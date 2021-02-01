# hardW-backend

Back-end do projeto hardW desenvolvido com Node JS e express

Trata-se de uma plataforma de anúncios de hardware(peças de computador), onde o usuário pode criar o seu perfil e cadastrar seus anúncios.
Na página principal o usuário visualiza o anúncio de outras pessoas, podendo aplicar filtros para encontrar o anúncio ideal, efetuar perguntas em anúncios ou, se preferir, 
entrar em contato com o anunciante via whatsapp.
Também é possível editar o perfil, os anúncios e responder as perguntas feitas em seus anúncios, uma mistura de OLX com mercadolivre(as perguntas no anúncio), porém voltados
para hardware.
Projeto próprio desenvolvido do zero com a finalidade de aprendizado.
Na parte de back-end, foi possível aprender e aprimorar itens interessantes como: 

##### Segurança, verificando se o que está sendo modificado no servidor pertence ao autor da requisição
##### Upload de imagens para um serviço externo(foi utilizado o Cloudinary)
##### Utilização de cache para armazenar refresh tokens e tokens de recuperação de senha(foi utilizado o Redis)
##### Utilização do orm Sequelize, para comunicação com banco de dados(migrations, models, seeders, transactions)
##### Autenticação via Jsonwebtoken, rotas autenticadas
##### Middlewares
##### Envio de email para recuperação de senha (foi utilizado o Nodemailer)
##### Utilização de variaveis de ambiente, para conexão com banco de dados e serviços externos (cloudinary, redis, email)

entre outras coisas, como as rotas necessárias para a aplicação funcionar.
A aplicação final (frontend) que faz o uso da API está disponível em: https://hardw.netlify.app

