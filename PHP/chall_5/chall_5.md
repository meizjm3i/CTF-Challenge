# HITCONCTF 2015 giraffe's coffee
include : index.php  index.tpl.html   config.php

tag:

index.php: 
```php
<?php 
    include "config.php";
    mysql_connect($dbhost, $dbuser, $dbpass);
    mysql_select_db($dbname);
    function escape($str){
        $str = strtolower($str);
        $str = str_replace("'", "", $str);
        $str = str_replace("\\", "", $str);
        $str = trim($str);
        return $str;
    }
    function random_str($length){
        $base = '0123456789abcdefghijklmnopqrstuvwxyz';
        $str = '';
        for ($i=0; $i<$length; $i++){
            $str .= $base[ mt_rand(0, strlen($base)-1) ];
        }
        return $str;
    }
    function simple_mail($mail, $msg){
        $socket = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        @socket_connect($socket, $mail, 110);
        @socket_write($socket, "token=$msg\n");
        @socket_close($socket);
    }
    function check_user_exists($username){
        $sql    = sprintf("SELECT * FROM users WHERE username='%s'", $username);
        $result = mysql_query($sql);
        $count  = mysql_num_rows($result);
        if ( $count > 0 ){
            return True;
        } else {
            return False;
        }
    }
    function get_user_profile($username){
        $sql = sprintf("SELECT * FROM users WHERE username='%s'", $username);
        $result = mysql_query($sql);
        $record = mysql_fetch_object($result);
        return $record;
    }
    function user_regiseter($username, $password, $mail){
        $sql = sprintf("INSERT INTO users(username, password, mail) VALUES('%s', '%s', '%s')", $username, md5($password), $mail );
        $result = mysql_query($sql);
    }
    function update_user_password($username, $password){
        $sql = sprintf("UPDATE users SET password='%s' WHERE username='%s'", 
                       md5($password), 
                       $username );
        $result = mysql_query($sql);
    }
    function check_token_exists($token){
        $sql = sprintf("SELECT * FROM tokens WHERE ip='%s' and token='%s'", 
                       $_SERVER['REMOTE_ADDR'], 
                       $token);
        $result = mysql_query($sql);
        $count  = mysql_num_rows($result);
        if ( $count > 0 ){
            return True;
        } else {
            return False;
        }
    }
    function get_token($token){
        $sql = sprintf("SELECT * FROM tokens WHERE ip='%s' and token='%s'", 
                       $_SERVER['REMOTE_ADDR'], 
                       $token);
        $result = mysql_query($sql);
        return mysql_fetch_object($result);
    }
    function insert_token($username, $token){
        $sql = sprintf("INSERT INTO tokens(username, token, ip) VALUES('%s', '%s', '%s')", 
                       $username, 
                       $token, 
                       $_SERVER['REMOTE_ADDR'] );
        $result = mysql_query($sql);
    }
    function delete_token($data, $by_what='token'){
        $sql = sprintf("DELETE FROM tokens WHERE %s='%s' and ip='%s'", 
                           $by_what,
                           $data, 
                           $_SERVER['REMOTE_ADDR']);
        $result = mysql_query($sql);
    }
    function insert_fail($ip){
        $sql = sprintf("INSERT INTO fail2ban(ip) VALUES('%s')", $ip);
        $result = mysql_query($sql);
    }
    function get_fail_count($ip){
        $sql = sprintf("SELECT * FROM fail2ban WHERE ip='%s'", $ip);
        $result = mysql_query($sql);
        $count  = mysql_num_rows($result);
        return $count;
    }
    $mode = $_POST['mode'];
    if ( $mode == 'login' ){
        $username = escape( $_POST['username'] );
        $password = escape( $_POST['password'] );
        $record = get_user_profile($username);
        if ( $record->password == md5($password) ){
            if ( $record->username == 'admin' ){
                $new_password = random_str(16);
                update_user_password('admin', $new_password);
                
                print 'Congratulations, the flag is ' . $FLAG;
            } else {
                print 'you are not admin';
            }
        } else {
            print 'login failed';
        }
    } else if ( $mode == 'register' ){
        $username = escape( $_POST['username'] );
        $password = escape( $_POST['password'] );
        $mail    = $_SERVER['REMOTE_ADDR'];
        if (strlen($username) < 3 or strlen($password) < 3){
            print 'too small';
        } else if (strlen($username) > 255 or strlen($password) > 255){
            print 'too large';
        } else if ( check_user_exists($username) ){
            print 'user registed';
        } else {
            user_regiseter($username, $password, $mail);
            print 'register ok';
        }
    } else if ( $mode == 'verify' ){
        $token = escape($_POST['token']);
        $ip    = $_SERVER['REMOTE_ADDR'];
        $token = (int)$token ^ ip2long($ip);
        if ( get_fail_count($ip) > 1000 ){
            print 'dont brute force';
        } else if ( check_token_exists($token) ){
            $record = get_token($token);
            $new_password = random_str(16);
            update_user_password($record->username, $new_password);
            delete_token($token);
            print 'ok. your new password: ' . $new_password;
        } else {
            insert_fail($ip);
            print 'what do you do?';
        }
    } else if ( $mode == 'reset' ){
        $username = escape($_POST['username']);
        if ( !check_user_exists($username) ){
            print 'user not registed';
        } else {
            $record = get_user_profile($username);
            $username = $record->username;
            $mail     = $record->mail;
            $key      = $_SERVER['REMOTE_ADDR'];
            $token = ip2long($key) ^ mt_rand();
            delete_token($username, 'username');
            insert_token($username, $token);
            simple_mail($mail, $token);
        }
    } else {
        readfile('index.tpl.html');
    }
?>
```

index.tpl.html

```html
<!-- Cong that you notice this line, 
          the source code in the index.phps -->
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
  <title> Giraffe's Coffee</title>
  <link rel="stylesheet" href="bootstrap.min.css">
  <style>
    body{background: #eee url(sativa.png);}
    html,body{
        position: relative;
        height: 100%;
    }
    #output{
        position: absolute;
        width: 300px;
        top: -75px;
        left: 0;
        color: #fff;
    }
    .login-container{
        position: relative;
        width: 300px;
        margin: 80px auto;
        padding: 20px 40px 40px;
        text-align: center;
        background: #fff;
        border: 1px solid #ccc;
    }
    .login-container::before,.login-container::after{
        content: "";
        position: absolute;
        width: 100%;height: 100%;
        top: 3.5px;left: 0;
        background: #fff;
        z-index: -1;
        -webkit-transform: rotateZ(4deg);
        -moz-transform: rotateZ(4deg);
        -ms-transform: rotateZ(4deg);
        border: 1px solid #ccc;
    }
    .login-container::after{
        top: 5px;
        z-index: -2;
        -webkit-transform: rotateZ(-2deg);
         -moz-transform: rotateZ(-2deg);
          -ms-transform: rotateZ(-2deg);
    }
    .avatar{
        width: 150px;height: 150px;
        margin: 10px auto 30px;
        border-radius: 100%;
        border: 2px solid #aaa;
        background-size: cover;
        background-image: url(http://40.media.tumblr.com/07510cd53d4e0934dcaaecffa9d39ca6/tumblr_nkrj74wm4w1qipdnro1_500.jpg);
        background-position: 36%;
        
    }
    .form-box input{
        width: 100%;
        padding: 10px;
        text-align: center;
        height:40px;
        border: 1px solid #ccc;;
        background: #fafafa;
        transition:0.2s ease-in-out;
    }
    .form-box input:focus{
        outline: 0;
        background: #eee;
    }
    .form-box input[type="text"]{
        border-radius: 5px 5px 0 0;
        text-transform: lowercase;
    }
    .form-box input[type="password"]{
        border-radius: 0 0 5px 5px;
        border-top: 0;
    }
    .form-box button.login{
        margin-top:15px;
        padding: 10px 20px;
    }
  </style>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

  <script TYPE="text/javascript">
    function register(username, password){
  		$.post( '/', 
  				{'username': username, 'password': password, 'mode': 'register'},
  				function(data){
                    $("#output").removeClass(' alert alert-success');
                    $("#output").addClass("alert alert-danger animated fadeInUp")
                    $("#output").html(data);
                    window.setTimeout(function(){
                      window.location.href = '/';
                    }, 1500);
  				} );    	
    }
  	function send(username, password){
  		$.post( '/', 
  				{'username': username, 'password': password, 'mode': 'login'},
  				function(data){
                    $("#output").removeClass(' alert alert-success');
                    $("#output").addClass("alert alert-danger animated fadeInUp")
                    $("#output").html(data);
                    window.setTimeout(function(){
                      window.location.href = '/';
                    }, 1500);
  				} );
  	}
  </script>
</head>
<body>

<div class="container">
  <div class="login-container">
    <div id='output'>
    </div>
    <div class="avatar"></div>
    <div class="form-box">
      <form method='POST' onsubmit='send(this.username.value, this.password.value);return false;'>
        <input name="username" type="text" placeholder="username" autofocus="autofocus" >
        <input type="password" name="password" placeholder="password">
        <button class="btn btn-info btn-block login" type="submit"> Login </button>
        <button class="btn btn-info btn-block login" type="button" onclick='register(this.form.username.value, this.form.password.value);'> Register </button>
      </form>
    </div>
  </div>        
</div>

</body>
</html>
```


config.php 

```php
<?php
	$dbhost = '127.0.0.1';
	$dbuser = 'root';
	$dbpass = 'root';
	$dbname = 'giraffe';
	$FLAG = 'hitcon{howsgiraffesfeeling?no!youonlythinkofyourself}';
/*
CREATE TABLE users (id int AUTO_INCREMENT, 
username text, 
password text, 
mail text, 
PRIMARY KEY(id)); 
CREATE TABLE fail2ban (id int AUTO_INCREMENT, 
ip text, 
PRIMARY KEY(id)
);
CREATE TABLE tokens (id int AUTO_INCREMENT, 
username text,
ip text,
token text, 
ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
PRIMARY KEY(id));
INSERT INTO users(username, password, mail) VALUES ( 'admin', '3e333ffaac0ff1ae70083a1533787db2', '127.0.0.1' );
*/
```
