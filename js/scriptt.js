    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const paddleWidth = 80;
    const paddleHeight = 10;
    const ballRadius = 10;
    let paddleX = (canvas.width - paddleWidth) / 2;
    var brickRowCount = 5;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 30;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 300;
    var score = 0;
    var lives = 2;

    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

        let ball = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            radius: 10,
            dx: 3,
            dy: -3,
            rotation: 0,
            scale: 1
        };

       // Eventos de teclado para controlar as transformações
        window.addEventListener('keydown', function(event) {
             if (event.key === 'ArrowUp') {
                ball.scale += 0.1;
             } else if (event.key === 'ArrowDown') {
                ball.scale -= 0.1;
            }
        });

        // Evento de teclado para mover a plataforma
      window.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' && paddleX > 0) {
          paddleX -= 10;
        } else if (e.key === 'ArrowRight' && paddleX < canvas.width - paddleWidth) {
          paddleX += 10;
        }
      });

        // Função para desenhar a bola
        function drawBall() {
            ctx.save();
            
            // Translate
            ctx.translate(ball.x, ball.y);
            
            // Scale
            ctx.scale(ball.scale, ball.scale);

            // Rotate
            ctx.rotate(ball.rotation);

            // Clipping Path
            ctx.beginPath();
            ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
            ctx.clip();
            
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(-ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);

            ctx.restore();
        }

// Função para desenhar a plataforma
function drawPaddle() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

        
      }


      function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var brick = bricks[c][r];
      if (brick.status == 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          // A bola colidiu com um tijolo
          ball.dy = -ball.dy; // Inverta a direção vertical
          brick.status = 0; // Marque o tijolo como colidido
          score++; // Aumente a pontuação
          if (score == brickRowCount * brickColumnCount) {
            // Verifique se todos os tijolos foram destruídos
            alert('Parabéns! Você ganhou o jogo.');
            document.location.reload(); // Recarregue a página para reiniciar o jogo
          }
        }
      }
    }
  }
}


      function drawBricks() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
      
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Pontos: "+score, 8, 20);
    }
    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Vidas: "+lives, canvas.width-65, 20);
    }
    
// Função de atualização do jogo
function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Verifique colisão com as bordas
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Colisão com a parte inferior (fim do jogo)
        if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
            // A bola colidiu com a plataforma
            ball.dy = -ball.dy;
        } else {
            // A bola caiu, reinicie o jogo
            lives--;
            if (lives === 0) {
                // Game Over
                alert("Game Over");
                document.location.reload();
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

 collisionDetection(); // Verifique colisões com os tijolos

    // Atualize a posição da bola
    ball.x += ball.dx;
    ball.y += ball.dy;

    drawPaddle();
    drawBall();
    drawBricks();
    drawLives();
    drawScore();
    requestAnimationFrame(updateGameArea);
    requestAnimationFrame(draw);
}


        // Inicie o jogo
        updateGameArea();