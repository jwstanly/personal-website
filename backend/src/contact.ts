import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import SES from 'aws-sdk/clients/ses';
import { ContactMessage } from '../../lib/Types';
import validateHttpMethod from '../lib/validateHttpMethod';
import parseType from '../lib/parseType';
import logEvent from '../lib/logEvent';
import logInput from '../lib/logInput';
import getSuccessRes from '../lib/getSuccessRes';
import getErrorRes from '../lib/getErrorRes';
import ApiException from '../lib/ApiException';

const { AWS_REGION, DOMAIN_NAME, EMAIL_ADDRESS } = process.env;

const sesClient = new SES({ region: AWS_REGION });

export async function index(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    logEvent(event);

    validateHttpMethod(event, 'POST');

    const inputMessage = parseType<ContactMessage>(
      event.body,
      'ContactMessage',
    );

    logInput(inputMessage);

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

    const res = await sesClient.sendEmail(emailParams).promise();
    return getSuccessRes(event, res);
  } catch (error) {
    if (error instanceof ApiException) {
      return getErrorRes(event, error);
    } else {
      return getErrorRes(
        event,
        new ApiException({
          statusCode: 500,
          res: `An unknown error occurred. Error: ${error}`,
        }),
      );
    }
  }
}
