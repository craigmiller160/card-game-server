import fs from 'fs';
import path from 'path';
import { constants } from 'crypto';
import {ServerOptions} from 'https';

const ciphers = [
	'ECDHE-ECDSA-AES256-GCM-SHA384',
	'ECDHE-RSA-AES256-GCM-SHA384',
	'ECDHE-ECDSA-CHACHA20-POLY1305',
	'ECDHE-RSA-CHACHA20-POLY1305',
	'ECDHE-ECDSA-AES128-GCM-SHA256',
	'ECDHE-RSA-AES128-GCM-SHA256',
	'ECDHE-ECDSA-AES256-SHA384',
	'ECDHE-RSA-AES256-SHA384',
	'ECDHE-ECDSA-AES128-SHA256',
	'ECDHE-RSA-AES128-SHA256'
];

const tlsProps: ServerOptions = {
	key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
	cert: fs.readFileSync(path.resolve(__dirname, '../cert/certificate.pem')),
	ciphers: ciphers.join(';'),
	minVersion: 'TLSv1.2'
};

export default tlsProps;
