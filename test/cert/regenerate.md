# Regenerating the local .key and .pem files

If the tests are failing with strange https or proxy errors, it is most likely that the local .key and .pem files are expired.  
You can regenerate them by calling this:

`openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout testCA.key -out testCA.pem -subj "/C=US/CN=CC-Root-CA"`