import React from 'react';
import { BlogArticle } from '../../../lib/Types';
import Api from '../../../lib/Api';
import getImageUrl from '../../../lib/getImageUrl';
import TextField from '../../../components/TextField';
import Button from '../../../components/Button';
import CodeBlockRenderer from '../../../components/markdown/CodeBlockRenderer';
import { spawn } from 'child_process';
import Store from 'electron-store';
import ErrorBoundary from '../../../components/ErrorBoundary';
import ArticleText from '../../../components/ArticleText';

const store = new Store();

export default function Home() {
  const [articles, setArticles] = React.useState<BlogArticle[]>();
  const [menuSelection, setMenuSelection] = React.useState<string>();

  function fetchArticles() {
    Api.getAllArticles().then(setArticles);
  }

  React.useEffect(fetchArticles, []);

  function MenuItem(props: {
    id: string;
    children?: React.ReactChild | React.ReactChild[];
  }) {
    return (
      <div
        className={
          menuSelection == props.id
            ? 'rounded-sm hover:bg-gray-200 duration-200 bg-gray-300'
            : 'rounded-sm hover:bg-gray-200 duration-200'
        }
      >
        <div
          onClick={() => setMenuSelection(props.id)}
          className="flex items-center p-2 space-x-3 rounded-md cursor-pointer select-none"
        >
          {props.children || <span>{props.id}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen">
      <title>jwstanly.com Admin</title>
      <div className="flex flex-col w-64 divide-y bg-gray-100">
        <div className="font-extrabold p-2 text-lg">jwstanly.com</div>
        <div className="flex-grow overflow-auto">
          <div className="pt-2 pb-4 space-y-1 text-sm">
            {articles?.map(article => (
              <MenuItem key={article.id} id={article.id}>
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  width={70}
                />
                <span>{article.title}</span>
              </MenuItem>
            ))}
          </div>
        </div>
        <div>
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <MenuItem id="Files" />
            <MenuItem id="New Article" />
            <MenuItem id="Deploy" />
          </ul>
        </div>
      </div>
      <div className="flex-1 flex-col overflow-auto">
        {articles?.map(a => a.id).includes(menuSelection) && (
          <ArticleEditor
            key={articles.find(a => a.id === menuSelection).id}
            article={articles.find(a => a.id === menuSelection)}
            onChange={fetchArticles}
          />
        )}
        {menuSelection == 'Deploy' && <Deploy />}
        {menuSelection == 'New Article' && (
          <ArticleEditor isNewArticle onChange={fetchArticles} />
        )}
      </div>
    </div>
  );
}

function ArticleEditor(props: {
  article?: BlogArticle;
  onChange?: () => any;
  isNewArticle?: boolean;
}) {
  const loadedArticle = props.isNewArticle
    ? (store.get('newArticle') as BlogArticle)
    : props.article;

  const [title, setTitle] = React.useState<string>(loadedArticle?.title);
  const [subheader, setSubheader] = React.useState<string>(
    loadedArticle?.subheader,
  );
  const [image, setImage] = React.useState<string>(loadedArticle?.image);
  const [tags, setTags] = React.useState<string>(
    loadedArticle?.tags?.join(', '),
  );
  const [content, setContent] = React.useState<string>(loadedArticle?.content);

  const [publishing, setPublishing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const article: BlogArticle = {
    ...props.article,
    title: title,
    subheader: subheader,
    image: image,
    tags: tags?.split(', '),
    content: content,
  };

  React.useEffect(() => {
    if (props.isNewArticle) {
      store.set('newArticle', article);
    }
  }, [article]);

  async function updateArticle() {
    setPublishing(true);

    if (
      !title ||
      !subheader! ||
      !image ||
      !tags.split(', ').length ||
      !content
    ) {
      setError('Empty Attributes');
      setPublishing(false);
      return;
    }

    delete (article as any).PartitionKey;
    if (props.article.title !== title) {
      await Api.deleteArticle(props.article);
    }
    await Api.upsertArticle(article);
    await props.onChange?.();
    setPublishing(false);
  }

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col h-screen">
        <div className="font-extrabold p-2 text-lg">Edit</div>
        <div className="flex-grow overflow-auto divide-y-2">
          <ul className="p-4 space-y-1 text-sm">
            <div className="text-red-500 mb-4">{error}</div>
            <TextField label="Title" value={title} setValue={setTitle} />
            <TextField
              label="Subheader"
              value={subheader}
              setValue={setSubheader}
            />
            <TextField label="Image" value={image} setValue={setImage} />
            <TextField label="Tags" value={tags} setValue={setTags} />
            <TextField
              label="Content"
              value={content}
              setValue={setContent}
              lines={1000}
            />
          </ul>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <div className="flex flex-row justify-between align-end">
          <div className="font-extrabold p-2 text-lg">Preview</div>
          <div className="p-2">
            <Button
              text="Publish Article"
              onPress={updateArticle}
              small
              loading={publishing}
            />
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <ErrorBoundary
            errorContent={<div className="text-red-500">Parsing Error</div>}
          >
            <ArticleText content={content} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function Deploy() {
  const [output, setOutput] = React.useState<string>('');
  const [deployed, setDeployed] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const ls = spawn(
      'cd /Users/jwstanly/personal-website && yarn deploy:frontend',
      {
        shell: true,
      },
    );
    ls.stdout.on('data', data => {
      setOutput(out => out + data);
    });
    ls.stderr.on('data', data => {
      setError('Error');
      setOutput(err => err + data);
    });
    ls.on('close', code => {
      setDeployed(true);
    });
  }, []);

  return (
    <div className="p-10">
      <div className="font-extrabold p-2 text-lg">
        {deployed ? 'Deployed!' : 'Deploying...'}
      </div>
      <div className="text-red-500 mb-4">{error}</div>
      <CodeBlockRenderer value={output} language="shell" />
    </div>
  );
}
