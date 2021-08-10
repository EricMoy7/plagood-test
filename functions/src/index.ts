import * as functions from 'firebase-functions';
import firebase from './firebase';

const db = firebase.database(); //Same thing as admin

const getUserData = functions.https.onCall(
	async (data: { id: string }, context) => {
		//Need to verify user from context.auth

		//uid can be grabbed from context on production
		//const {uid} = context;

		//This is for unit testing with firebase functions shell
		const { id } = data;

		try {
			//Get users from myPosts path
			const snapUser = await db.ref(`/myPosts/${id}/`).get();
			if (snapUser.exists()) {
				const snapListObject = snapUser.val();

				//Initalize userPosts lists for return
				let userPosts: any[] = [];

				//Loop through user posts and append to userPosts array
				for (let post in snapListObject) {
					if (snapListObject[post] === true) {
						const snapPost = await db.ref(`posts/${post}`).get();
						if (snapPost.exists()) {
							userPosts = [...userPosts, snapPost.val()];
						}
					}
				}

				return userPosts;
			} else {
				console.log('User data not availible');
				return 'User data not availible';
			}
		} catch (error) {
			console.log(`Error: ${error}`);
			return error;
		}
	}
);

//This was an attempt at Promising chaining, but just makes the code too complex for one function
//This could possible be used for asynchronous lazy loading if the front end allows

// const getUserData = functions.https.onCall((data, context) => {
// 	//User authentication needs to get verified

// 	const { id } = data;
// 	const ref = db.ref(`/myPosts/${id}/`);

// 	ref
// 		.get()
// 		.then((snap) => {
// 			if (snap.exists()) {
// 				const snapListObject = snap.val();

// 				const promise: Promise<any[]> = new Promise((resolve, reject) => {
// 					let listOfPosts: any[] = [];
// 					Object.keys(snapListObject).forEach((post) => {
// 						if (snapListObject[post] === true) {
// 							const postRef = db.ref(`/posts/${post}`);
// 							postRef.get().then((snap) => {
// 								const postListObject = snap.val();
// 								listOfPosts = [...listOfPosts, postListObject];
// 							});
// 						}
// 					});
// 					resolve(listOfPosts);
// 				});

// 				const list = promise.then((listOfPosts: any[]) => {
// 					console.log(listOfPosts.length);
// 					return listOfPosts;
// 				});

// 				return list;
// 			} else {
// 				console.log('User data not availible');
// 				return;
// 			}
// 		})
// 		.catch((error) => console.log(error));
// });

module.exports = {
	getUserData,
};
