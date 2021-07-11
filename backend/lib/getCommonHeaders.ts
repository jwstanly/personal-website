export default function getCommonHeaders() {
  return {
    headers: {
      'Access-Control-Allow-Headers':
        'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
      'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
      'Access-Control-Allow-Origin': '*', // DOMAIN_NAME
    },
  };
}
