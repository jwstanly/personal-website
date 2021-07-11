"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getSuccessRes: getSuccessRes,
    getErrorRes: getErrorRes,
    stripEmails: stripEmails,
    getEmailHTML: getEmailHTML,
};
function stripEmails(article) {
    if (article.comments) {
        for (let i = 0; i < article.comments.length; i++) {
            if (article.comments[i].user && article.comments[i].user.email) {
                delete article.comments[i].user.email;
            }
            if (article.comments[i].replies) {
                for (let j = 0; j < article.comments[i].replies.length; j++) {
                    delete article.comments[i].replies[j].user.email;
                }
            }
        }
    }
}
function getSuccessRes(event, body) {
    const response = Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: 200, body: JSON.stringify(body) });
    // Prints in CloudWatch
    console.info(`SUCCESS: response from: ${event.path} statusCode: ${response.statusCode} response: ${JSON.stringify(response)}`);
    return response;
}
function getErrorRes(event, statusCode, message) {
    const response = Object.assign(Object.assign({}, getCommonHeaders()), { statusCode: statusCode, body: JSON.stringify({
            error: message,
        }) });
    // Prints in CloudWatch
    console.info(`ERROR: response from: ${event.path} statusCode: ${statusCode} response: ${JSON.stringify(response)}`);
    return response;
}
function getCommonHeaders() {
    return {
        headers: {
            'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
            'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
            'Access-Control-Allow-Origin': '*', //'https://www.jwstanly.com'
        },
    };
}
function getEmailHTML(domainName, article, originalComment, commentReply) {
    return `
    <!DOCTYPE html
      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
      <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width" name="viewport" />
      <!--[if !mso]><!-->
      <meta content="IE=edge" http-equiv="X-UA-Compatible" />
      <!--<![endif]-->
      <title></title>
      <!--[if !mso]><!-->
      <!--<![endif]-->
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
        }

        table,
        td,
        tr {
          vertical-align: top;
          border-collapse: collapse;
        }

        * {
          line-height: inherit;
        }

          a[x-apple-data-detectors=true] {
            color: inherit !important;
            text-decoration: none !important;
          }
        </style>
        <style id="media-query" type="text/css">
          @media (max-width: 520px) {

            .block-grid,
            .col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }

            .block-grid {
              width: 100% !important;
            }

            .col {
              width: 100% !important;
            }

            .col_cont {
              margin: 0 auto;
            }

            img.fullwidth,
            img.fullwidthOnMobile {
              max-width: 100% !important;
            }

            .no-stack .col {
              min-width: 0 !important;
              display: table-cell !important;
            }

            .no-stack.two-up .col {
              width: 50% !important;
            }

            .no-stack .col.num2 {
              width: 16.6% !important;
            }

            .no-stack .col.num3 {
              width: 25% !important;
            }

            .no-stack .col.num4 {
              width: 33% !important;
            }

            .no-stack .col.num5 {
              width: 41.6% !important;
            }

            .no-stack .col.num6 {
              width: 50% !important;
            }

            .no-stack .col.num7 {
              width: 58.3% !important;
            }

            .no-stack .col.num8 {
              width: 66.6% !important;
            }

            .no-stack .col.num9 {
              width: 75% !important;
            }

            .no-stack .col.num10 {
              width: 83.3% !important;
            }

            .video-block {
              max-width: none !important;
            }

            .mobile_hide {
              min-height: 0px;
              max-height: 0px;
              max-width: 0px;
              display: none;
              overflow: hidden;
              font-size: 0px;
            }

            .desktop_hide {
              display: block !important;
              max-height: none !important;
            }
          }
        </style>
        <style id="icon-media-query" type="text/css">
          @media (max-width: 520px) {
            .icons-inner {
              text-align: center;
            }

            .icons-inner td {
              margin: 0 auto;
            }
          }
        </style>
      </head>

      <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
          style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
          valign="top" width="100%">
          <tbody>
            <tr style="vertical-align: top;" valign="top">
              <td style="word-break: break-word; vertical-align: top;" valign="top">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                <div style="background-color:transparent;">
                  <div class="block-grid"
                    style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                      <div class="col num12"
                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                        <div class="col_cont" style="width:100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div
                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table cellpadding="0" cellspacing="0" role="presentation"
                              style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                              valign="top" width="100%">
                              <tr style="vertical-align: top;" valign="top">
                                <td align="center"
                                  style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                  valign="top" width="100%">
                                  <h1
                                    style="color:#222222;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:36px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                    <strong>${domainName}</strong></h1>
                                </td>
                              </tr>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                              style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                              valign="top" width="100%">
                              <tbody>
                                <tr style="vertical-align: top;" valign="top">
                                  <td class="divider_inner"
                                    style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 15px; padding-right: 0px; padding-bottom: 20px; padding-left: 0px;"
                                    valign="top">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                                      role="presentation"
                                      style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                      valign="top" width="100%">
                                      <tbody>
                                        <tr style="vertical-align: top;" valign="top">
                                          <td
                                            style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                            valign="top"><span></span></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" role="presentation"
                              style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                              valign="top" width="100%">
                              <tr style="vertical-align: top;" valign="top">
                                <td align="center"
                                  style="word-break: break-word; vertical-align: top; padding-bottom: 10px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                  valign="top" width="100%">
                                  <h1
                                    style="color:#222222;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;">
                                    <strong>You have a response!</strong></h1>
                                </td>
                              </tr>
                            </table>
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                            <div
                              style="color:#222222;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                              <div class="txtTinyMce-wrapper"
                                style="line-height: 1.2; font-size: 12px; color: #222222; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14px;">
                                <p dir="ltr"
                                  style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">
                                  Your comment on ${article.title} has gotten a response${commentReply.user.name ? ` from ${commentReply.user.name}` : ''}:
                                </p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 20px; padding-top: 30px; padding-bottom: 30px; font-family: Arial, sans-serif"><![endif]-->
                            <div
                              style="color:#666666;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:30px;padding-right:0px;padding-bottom:30px;padding-left:20px;">
                              <div class="txtTinyMce-wrapper"
                                style="font-size: 12px; line-height: 1.2; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14px;">
                                <p dir="ltr"
                                  style="font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin: 0;">
                                  <em>${commentReply.comment}</em></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <div align="left" class="button-container"
                              style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://${domainName}/blog/article/${article.title
        .split(' ')
        .join('+')}" style="height:31.5pt;width:111pt;v-text-anchor:middle;" arcsize="20%" stroke="false" fillcolor="#222222"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px"><![endif]--><a
                                href="https://${domainName}/blog/article/${article.title
        .split(' ')
        .join('+')}"
                                style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #222222; border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; width: auto; width: auto; border-top: 1px solid #222222; border-right: 1px solid #222222; border-bottom: 1px solid #222222; border-left: 1px solid #222222; padding-top: 5px; padding-bottom: 5px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
                                target="_blank"><span
                                  style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;letter-spacing:undefined;"><span
                                    style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span
                                      data-mce-style="font-size: 14px; line-height: 28px;"
                                      style="font-size: 14px; line-height: 28px;">View Reply</span></span></span></a>
                              <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                            </div>
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="margin-top:5px;"></div>
                            <a href="https://${domainName}/blog/unsubscribe?title=${article.title
        .split(' ')
        .join('+')}&commentId=${originalComment.id}&email=${originalComment.user.email}"
                              style="text-decoration:none;cursor:pointer;color:#666;font-size:11px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                              Unsubscribe
                            </a>
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                <div style="background-color:transparent;">
                  <div class="block-grid"
                    style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                      <div class="col num12"
                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                        <div class="col_cont" style="width:100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div
                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <table cellpadding="0" cellspacing="0" role="presentation"
                              style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                              valign="top" width="100%">
                              <tr style="vertical-align: top;" valign="top">
                                <td align="center"
                                  style="word-break: break-word; vertical-align: top; padding-top: 5px; padding-right: 0px; padding-bottom: 5px; padding-left: 0px; text-align: center;"
                                  valign="top">
                                  <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                  <!--[if !vml]><!-->
                                  <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation"
                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"
                                    valign="top">
                                    <!--<![endif]-->
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                      <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
      </body>

      </html>
  `.replace(/(\r\n|\n|\r|\t|  )/gm, '');
}
//# sourceMappingURL=lambdaUtils.js.map