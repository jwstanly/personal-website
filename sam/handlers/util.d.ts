declare const _default: {
    getHeaders: typeof getHeaders;
};
export default _default;
declare function getHeaders(res: {
    body: string;
}): {
    body: string;
    statusCode: number;
    headers: {
        'Access-Control-Allow-Headers': string;
        'Access-Control-Allow-Methods': string;
        'Access-Control-Allow-Origin': string;
    };
};
export interface BlogArticle {
    id: string;
    title: string;
    urlEncodedTitle: string;
    subheader: string;
    image?: string;
    tags: string[];
    createdAt: number;
    lastModifiedAt: number;
    content: string;
}
