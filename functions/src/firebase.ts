import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './credentials.json';

firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as { [key: string]: string } | ServiceAccount
	),
	databaseURL: 'https://plagood-staging.firebaseio.com',
});

export default firebase;
