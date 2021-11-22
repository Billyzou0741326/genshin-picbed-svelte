# Keys

Keys are used to sign and verify jwt (JSON web tokens).

## ES512

Generate keys with the following commands:

```bash
openssl ecparam -genkey -name secp521r1 -noout -out jwt_private_key.pem
openssl ec -in jwt_private_key.pem -pubout -out jwt_public_key.pem
```
