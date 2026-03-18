1> in order to post username and password while signin and login:
    {
        "name" : "Name",
        "password" : "Password"
    }
pass this in the body in this format and copy the token for authorization and pass it through the headers 

2> in order to pass the token through headers during certain get requests:

    headers.authorization = jwt

this should be present

3> in order to post todo:
    {
        "todo" : {
            "task" : "Go to gym",
            "done" : true
        }
    }

pass this in the body in this format and dont forget to pass the token in the headers

4> There's one bug, you can signin multiple times so a user can have multiple instances of his account so u can even fix it or keep it as it is

5> Play with this backend server made using notepadDB(notepad Database) as much as you want or can even introduce security layers and make a fully fledged backend server with actual DB

Have fun <3  ~ Bratin Das 