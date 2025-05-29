import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-west-1_hQy8a6iMh',
      userPoolClientId: '2daucvgmoisqflj8i0m3o7h89t',
      userPoolRegion: 'eu-west-1',
    }
  }
} as ResourcesConfig;

Amplify.configure(amplifyConfig);
