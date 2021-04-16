# Personal Website

This repo contains the full tech stack for my personal website, [jwstanly.com](https://www.jwstanly.com). 

The frontend was built using ReactJS with TypeScript. The backend was built on AWS SAM. Both the frontend and backend are deployed using CloudFormation.

## Project structure

- `/__tests__` - Unit tests for the SAM lambda functions. 
- `/build` - Production ready react code. Gitignored, but will populate upon running `yarn run build`.
- `/lambda-lib` - Contains a node makefile for building lambda deployment packages. 
- `/public` - Stores the react page template `public/index.html`. Only files inside public can be used from `public/index.html`.  
- `/backend` - Root directory for all SAM lambda functions. Noticeably, this folder contains a seperate `package.json`. All lambda deployment packages are are built with `backend/package.json` instead of the `package.json`. This `backend/package.json` contains many less modules. This reduces the size of the deployed lambda functions, and ensures react modules do not contribute to lambda bloat. 
- `/scripts` - ShellJS scripts to help with provisioning, building, and deploying. 
- `.env-cmdrc.sample.js` - A sample env-cmd rc file. Enables different staging environments. If you would like to use this repo, you must fill in your own ACM Certificate ARN and CloudFront Distribution ID. Once you've populated your own AWS configuration, rename the file to `.env-cmdrc.js`. More setup details below.
- `buildspec.yml` - Commands for SAM to run.
- `package.json` - The project wide package file. This stores all the react modules. Noticeably, this is different than `backend/package.json`. 
- `template.yml` - A CloudFormation template that defines the application's AWS resources. Uses a SAM transform to include serverless resources. 
- `tsconfig.json` - TypeScript compiler options for this project. 

## Stack

![personal website stack diagram](https://i.imgur.com/iKWYYP4.png "Personal Website Stack Diagram")

## Credit

Huge thanks to Ryan Yost and his [React Single Page Application Starter](https://github.com/ryanjyost/react-spa-starter)! This repo defined the CloudFormation resources for S3, CloudFront, and Route53. I also took inspiration from this repo to use ShellJS and env-cmd together for some nice staging environement aware scripts.

## Replication

Anyone is free to use this repo to build their own website. Follow the steps below...

## Replication Setup

- Ensure you have an AWS account. Make sure you do this through an IAM user and not root. 
- Install and configure your AWS CLI and SAM CLI. If you have multiple AWS CLI profiles, you will need to select one to deploy with. 
- `yarn install`. Includes React, TypeScript, ShellJS, env-cmd, and the AWS node SDK, among others. 
- Congiure your env-cmd rc file. I've included a sample `env-cmdrc.sample.js`. Replace the URL, AWS CLI profile, S3 bucket name, and ACM Certificate with your own, then rename the rc file to `env-cmdrc.js`. Before executing any of the following steps, you must submit your ACM Certificate ARN ahead of time. The ACM Certificate is NOT created by the CloudFormation template; you must do this independently. Your ACM Certificate should include base domain as well as `www` and `api` subdomains (YourWebsite.com, www.YourWebsite.com, api.YourWebsite.com). Once you have the ARM, paste it into your `env-cmdrc.js`. However, the CloudFormation template will create a CloudFront Distribution ID for you, so you can wait to paste this into your `env-cmdrc.js` after you've initially created your CloudFormation stack. The CloudFormation stack will output your CloudFront Distribution ID. 
- `yarn start` will launch your local react server
- `yarn sam-build` runs SAM build with your prodcution environement params. AWS SAM CLI installs dependencies that are defined in `backend/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.
- `yarn sam-deploy` runs SAM deploy with your production environement params. This packages and deploys your application to AWS. Noticeably, many of the resources defined in `template.yml` are not SAM derived and are standard CloudFormation resources. Because SAM is just a CloudFormation transform, we are still able to deploy typical CloudFormation resources. Upon `yarn sam-deploy` completing successfully, your website's CloudFormation stack will be deployed; however, you still need to actually upload your website contents to the stack. Additionally, take note of the CloudFront Distribution ID. You can use this in the following steps. 
- (In the future you can run `sam-build` and `sam-deploy` together with `yarn provision`)
- `yarn build` builds the react project into production ready code. Builds to `/build` 
- `yarn upload` uploads your react project to the S3 bucket for CloudFront to use. If you have pasted your CloudFront Distribution ID into the env-cmd rc file, this command will invalidate and remove previous builds sent to this distributions.
- (In the future you can run `build` and `upload` together with `yarn deploy`)
- You can now view your website on the auto generated URLs! For connecting your domain to the website, you will need to visit the Route 53 online console. Grab your autogenered NS records in the generated hosted zone. If your domain is with AWS, I'd image this is automated for you. However, if your domain was not bought on AWS, change your Nameservers on your own domain service to these four NS records generated by Route 53. For example, I bought my domain with GoDaddy, so I did this through GoDaddy's website. Some domain services will throw errors if you include the trailing `.` in the NS records. If this is the case, you can remove them from the NS records Route 53 gave you. Also, note that these DNS changes can take 24-48 hours to take effect. 
