var User=mongoose.model('User');
var mongoose=require('mongoose');
var nev=('email-verification')(mongoose);

nev.configure({
	verificationURL: 'http://localhost:3000/email-verification/${URL}',
	persistentUserModel: User,
	tempUserCollection:'tempUsers',

	transportOptions:{
		service:'Gmail',
		auth:{
			user:'bdemaio1@gmail.com',
			pass:'@youRay123'
		}
	},
	verifyMailOptions:{
		from:'Do Not Reply <bdemaio1_do_not_reply@gmail.com>'
		subject:'Please confirm badger-news account',
		html:'<p>Click the following link to confirm your account:</p><p>${URL}</p>',
		text:'Please confirm your account by clicking the following link:${URL}'
	}
},	function(error,options){	
});

