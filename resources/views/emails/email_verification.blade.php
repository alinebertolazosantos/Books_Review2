<!-- resources/views/emails/email_verification.blade.php -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verificação de E-mail</title>
</head>
<body>
  <h2>Olá, {{ $full_name }}!</h2>
  <p>Para completar seu registro, clique no botão abaixo:</p>
  <a href="{{ $link }}" style="padding:10px 20px; background-color:#5C7CE5; color:white; border-radius:5px; text-decoration:none;">Verificar E-mail</a>
  <p>Ou acesse o link diretamente: <a href="{{ $link }}">{{ $link }}</a></p>
</body>
</html>
