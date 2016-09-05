var nodemailer=require('nodemailer');

var smtpTransport=nodemailer.createTransport({
	from: 'bdemaio1@gmail.com',
	options:{
		service:'Gmail',
		auth:
		{
			user:'bdemaio1@gmail.com',
			pass:'@youRay123'
		}
	}
});