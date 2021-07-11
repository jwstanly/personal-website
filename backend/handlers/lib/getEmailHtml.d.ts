import { BlogArticle, BlogComment, BlogCommentReply, ContactMessage } from './Types';
export declare enum EmailType {
    CommentReply = "CommentReply",
    Contact = "Contact"
}
export default function getEmailHtml({ domainName, type, commentReplyInfo, contactInfo, }: {
    domainName: string;
    type: EmailType;
    commentReplyInfo?: {
        article: BlogArticle;
        originalComment: BlogComment | BlogCommentReply;
        commentReply: BlogCommentReply;
    };
    contactInfo: {
        inputMessage: ContactMessage;
    };
}): string;
