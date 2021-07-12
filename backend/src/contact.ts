import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import SES from 'aws-sdk/clients/ses';
import { HttpMethod } from '../../lib/enums';
import { ContactMessage, ServiceParams } from '../../lib/Types';
import createHandler from '../lib/createHandler';

const { AWS_REGION, DOMAIN_NAME, EMAIL_ADDRESS } = process.env;

const sesClient = new SES({ region: AWS_REGION });

export async function handler(event: APIGatewayProxyEvent) {
  return await createHandler({
    event,
    httpMethod: HttpMethod.POST,
    bodyParamType: 'ContactMessage',
    service,
  });
}

export async function service({
  body: inputMessage,
}: ServiceParams<null, ContactMessage>) {
  const emailParams: SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [EMAIL_ADDRESS],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Name: ${inputMessage.user.name} (${inputMessage.user.id})\n
                  Email: ${inputMessage.user.email}\n\n
                  Message: ${inputMessage.message}`,
        },
        // Html: {
        //   Charset: 'UTF-8',
        //   Data: getEmailHtml({
        //     DOMAIN_NAME: DOMAIN_NAME,
        //     type: EmailType.Contact,
        //     contactInfo: {
        //       inputMessage: inputMessage,
        //     },
        //   }),
        // },
      },
      Subject: {
        Charset: 'UTF-8',
        Data:
          inputMessage.subject ||
          `${inputMessage.user.name} has contacted you from ${DOMAIN_NAME}`,
      },
    },
    Source: `contact@${DOMAIN_NAME}`,
  };

  return await sesClient.sendEmail(emailParams).promise();
}
