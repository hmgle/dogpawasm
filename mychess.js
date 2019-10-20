class Chess {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.initCanvas();

    this.resetData();

  }

  // 重置数据，再来一局
  resetData() {
    this.redBottom = true; // 红方在下边（这个属性可以用来给不同的用户显示不同的棋盘）
    this.toMove = {};
    this.active = "red"; // 当前走棋方
    this.bottomColor = "red"; // 红方在下边
    this.chessSteps = []; // 走棋记录

    this.initChessBoard();
    this.initComposition();
    this.drawPieces();
  }

  // 切换走棋方
  exchange() {
    this.active = this.active == 'red' ? 'black' : 'red';
    // this.reverseChess();
  }

  // 反转棋局数组
  reverseChess() {
    this.composition = this.deepReverse(this.composition);
  }

  // 渲染棋盘和棋子
  renderUi() {
    //清除之前的画布
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initChessBoard();
    this.drawPieces();
  }

  // 输赢判断
  getVictor() {
    var flag = false;
    for (let i = 0, len = this.composition.length; i < len; i++) {
      for (let j = 0, len1 = this.composition[i].length; j < len1; j++) {
      }
    }
  }

  // 初始化canvas并绑定点击事件
  initCanvas() {
    var body = document.body;
    var h = body.clientHeight;
    var w = body.clientWidth;
    if (h > w) {
      this.cellWidth = w / 10;
    } else {
      this.cellWidth = h / 11;
    }
    this.width = this.cellWidth * 10;
    this.height = this.cellWidth * 11;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // 绑定点击事件
    this.canvas.addEventListener("click", (e) => {
      var offset = this.canvas.getBoundingClientRect();
      var x = Math.round((e.clientX - offset.left - this.cellWidth) / this.cellWidth);
      var y = Math.round((e.clientY - offset.top - this.cellWidth) / this.cellWidth);
      // 走棋
      if (x >= 0 && x <= 8 && y <= 9 && y >= 0) {
        this.goStep(y, x);
        console.log(this.chessSteps);
      } else {
        console.log("点在其他地方,没在棋局中");
      }
    }, false);

  }

  // 初始化棋盘
  initChessBoard() {
    //设置全局属性
    var padding = 2;
    var borderWidth = 5;
    var borderColor = "#333";
    var bgColor = "#a6753a";
    var lineColor = "#333";
    var fontColor = bgColor;
    var bgWidth = this.cellWidth - borderWidth - padding;


    // 画边框
    this.ctx.strokeStyle = bgColor;
    this.ctx.lineWidth = bgWidth * 2;
    this.ctx.lineJoin = "miter";
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.width, 0);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.stroke();

    // 画外边线
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.lineJoin = "miter";
    this.ctx.beginPath();
    this.ctx.moveTo(0 + bgWidth, 0 + bgWidth);
    this.ctx.lineTo(0 + this.width - bgWidth, 0 + bgWidth);
    this.ctx.lineTo(this.width - bgWidth, this.height - bgWidth);
    this.ctx.lineTo(0 + bgWidth, this.height - bgWidth);
    this.ctx.stroke();

    this.ctx.save();

    this.ctx.translate(this.cellWidth, this.cellWidth);
    this.ctx.beginPath();
    // 画横线
    for (let i = 0; i < 10; i++) {
      this.ctx.moveTo(0, this.cellWidth * i);
      this.ctx.lineTo(this.cellWidth * 8, this.cellWidth * i);
    }

    // 画纵线
    for (let i = 0; i < 9; i++) {
      this.ctx.moveTo(this.cellWidth * i, 0);
      this.ctx.lineTo(this.cellWidth * i, this.cellWidth * 4);
      this.ctx.moveTo(this.cellWidth * i, this.cellWidth * 5);
      this.ctx.lineTo(this.cellWidth * i, this.cellWidth * 9);
    }

    // 链接断线
    this.ctx.moveTo(0, this.cellWidth * 4);
    this.ctx.lineTo(0, this.cellWidth * 5);
    this.ctx.moveTo(this.cellWidth * 8, this.cellWidth * 4);
    this.ctx.lineTo(this.cellWidth * 8, this.cellWidth * 5);

    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // 写（楚河、汉界）汉字
    this.ctx.font = `${this.cellWidth*0.75}px 宋体`;
    this.ctx.fillStyle = fontColor;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText("楚", this.cellWidth * 1.5, this.cellWidth * 4.5);
    this.ctx.fillText("河", this.cellWidth * 2.5, this.cellWidth * 4.5);
    this.ctx.fillText("汉", this.cellWidth * 5.5, this.cellWidth * 4.5);
    this.ctx.fillText("界", this.cellWidth * 6.5, this.cellWidth * 4.5);

    // 画炮位
    var paoArr = [{
      x: 1,
      y: 2
    }, {
      x: 7,
      y: 2
    }, {
      x: 7,
      y: 7
    }, {
      x: 1,
      y: 7
    }];
    for (let i = 0, len = paoArr.length; i < len; i++) {
      this.markP(paoArr[i].x, paoArr[i].y);
    }
    // 画兵和卒位
    var bingArr = [];
    for (let i = 0; i < 9; i += 2) {
      bingArr.push({
        x: i,
        y: 3
      });
      bingArr.push({
        x: i,
        y: 6
      });
    }

    // 画皇宫
    this.ctx.beginPath();
    this.ctx.moveTo(this.cellWidth * 3, 0);
    this.ctx.lineTo(this.cellWidth * 5, this.cellWidth * 2);
    this.ctx.moveTo(this.cellWidth * 5, 0);
    this.ctx.lineTo(this.cellWidth * 3, this.cellWidth * 2);

    this.ctx.moveTo(this.cellWidth * 3, this.cellWidth * 9);
    this.ctx.lineTo(this.cellWidth * 5, this.cellWidth * 7);
    this.ctx.moveTo(this.cellWidth * 5, this.cellWidth * 9);
    this.ctx.lineTo(this.cellWidth * 3, this.cellWidth * 7);
    this.ctx.stroke();

    for (let i = 0, len = bingArr.length; i < len; i++) {
      this.markP(bingArr[i].x, bingArr[i].y);
    }

    this.ctx.restore();
  }

  // 方向数字化
  nd(direction) {
    var res = {
      h: 0,
      v: 0
    }; // h horizontal v vertical
    switch (direction) {
      case "r":
        res.h = 1;
        res.v = 0;
        break;
      case "rd":
        res.h = 1;
        res.v = 1;
        break;
      case "d":
        res.h = 0;
        res.v = 1;
        break;
      case "ld":
        res.h = -1;
        res.v = 1;
        break;
      case "l":
        res.h = -1;
        res.v = 0;
        break;
      case "lt":
        res.h = -1;
        res.v = -1;
        break;
      case "t":
        res.h = 0;
        res.v = -1;
        break;
      case "rt":
        res.h = 1;
        res.v = -1;
        break;
      default:
        console.error("方向输入有误");
    }
    return res;
  }

  markP(x, y) { // 标出上下左右
    var arr = [];
    if (x === 0) {
      arr = ["rt", "rd"];
    } else if (x === 8) {
      arr = ["lt", "ld"];
    } else {
      arr = ["lt", "rt", "rd", "ld"];
    }

    var padding = this.cellWidth / 10;
    var length = this.cellWidth / 5
    for (let i = 0; i < arr.length; i++) {
      this.mark(x, y, arr[i], padding, length);
    }
  }

  // 四个标记中的一个
  mark(x, y, direction, padding, length) {
    var d = this.nd(direction);
    var h = d.h;
    var v = d.v;

    this.ctx.beginPath();
    this.ctx.moveTo(this.cellWidth * x + h * (padding + length), this.cellWidth * y + v * padding);
    this.ctx.lineTo(this.cellWidth * x + h * padding, this.cellWidth * y + v * padding);
    this.ctx.lineTo(this.cellWidth * x + h * padding, this.cellWidth * y + v * (padding + length));
    this.ctx.stroke();
  }

  // 初始化棋局
  initComposition() {
    var origin = [
      ["車", "馬", "象", "士", "将", "士", "象", "馬", "車"],
      ["", "", "", "", "", "", "", "", ""],
      ["", "炮", "", "", "", "", "", "炮", ""],
      ["卒", "", "卒", "", "卒", "", "卒", "", "卒"],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["兵", "", "兵", "", "兵", "", "兵", "", "兵"],
      ["", "砲", "", "", "", "", "", "砲", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["車", "馬", "相", "仕", "帥", "仕", "相", "馬", "車"]
    ];

    this.composition = [];
    for (let i = 0, len = origin.length; i < len; i++) {
      this.composition[i] = [];
      for (let j = 0, len1 = origin[i].length; j < len1; j++) {
        if (origin[i][j] == "") {
          this.composition[i][j] = null;
        } else {
          if (i <= 4) { // 黑方
            this.composition[i][j] = {
              color: "black",
              text: origin[i][j]
            };
          } else { // 红方
            this.composition[i][j] = {
              color: "red",
              text: origin[i][j]
            };
          }
        }
      }
    }
    console.log(this.composition);
  }

  // 画所有的棋子
  drawPieces() {
    for (let i = 0, len = this.composition.length; i < len; i++) {
      for (let j = 0, len1 = this.composition[i].length; j < len1; j++) {
        if (this.composition[i][j]) {
          // this.composition[i][j].drawOnePiece();
          this.drawOnePiece(j, i, this.composition[i][j].text, this.composition[i][j].color)
        }
      }
    }
  }

  // 画一个棋子
  drawOnePiece(x, y, text, color) {
    var r = this.cellWidth * 0.45;
    var xx = this.cellWidth * x + this.cellWidth;
    var yy = this.cellWidth * y + this.cellWidth;
    var bgColor = "black"; //"#eab885";

    this.ctx.save();
    let radgrad = this.ctx.createRadialGradient(xx, yy, r, xx, yy, r * 0.8);
    radgrad.addColorStop(0, "#de9555");
    radgrad.addColorStop(0.75, "#de9555");
    radgrad.addColorStop(1, "#eab885");
    this.ctx.fillStyle = radgrad;
    this.ctx.beginPath();
    this.ctx.arc(xx, yy, r, 0, Math.PI * 2);
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = "rgba(53,29,4,0.7)";
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.font = `${r*2*0.75}px 宋体`;
    this.ctx.fillStyle = color;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, xx, yy);
  }

  goStep(x, y) {
    // 已经选择了——1.换一个；（2.移动；3.吃子；）4.乱走；
    // 没有选择——1.选一个；2.乱选；
    if (Object.keys(this.toMove).length) {
      if (this.composition[x] && this.composition[x][y] && this.composition[x][y].color == this.active) { // 选择我方的棋子
        this.chooseToMove(x, y);
      } else { // 选择敌方的棋子
        if (this.inRange(x, y)) { // 吃子
          this.move(x, y);
          if ((isHumamRedSide && this.active == 'black') || (!isHumamRedSide && this.active == 'red')) {
            setTimeout(function() {
              dogpawMove(defaultDepth);
            }, 100);
          }
        } else { // 乱选
          console.log("还没有轮到你走棋");
        }
      }
    } else {
      if (this.composition[x] && this.composition[x][y] && this.composition[x][y].color == this.active) { // 选择我方的棋子
        this.chooseToMove(x, y);
      }
    }
  }

  // 已选择棋子是否可以移动
  oneCanMove() {
    if (this.moveRange.length) {
      return true;
    } else {
      return false;
    }
  }

  // 选择移动的棋子
  chooseToMove(x, y) {
    this.renderUi();
    this.getMoveRange(x, y);
    this.hint();

    this.toMove = {};
    if (this.oneCanMove()) {
      this.toMove.x = x;
      this.toMove.y = y;
      this.toMove.data = this.composition[x][y];
    } else {
      this.clearChoose();
      console.warn("这个棋子不可以移动");
    }
  }

  // 判断移动的最终位置是否在移动范围内
  inRange(x, y) {
    var flag = false;
    for (let i = 0, len = this.moveRange.length; i < len; i++) {
      if (x == this.moveRange[i].x && y == this.moveRange[i].y) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  // 是否为敌方 或 空    走棋用的判断
  isEnemyOrEmpty(x, y, color) {
    if (this.composition[x] && this.composition[x][y] === null) {
      return true;
    } else {
      if (this.composition[x] && this.composition[x][y] && this.composition[x][y].color != color) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 显示可以走的位置
  hint() {
    for (let i = 0, len = this.moveRange.length; i < len; i++) {
      this.drawHint(this.moveRange[i].x, this.moveRange[i].y);
    }
  }

  // 画一个提示点
  drawHint(x, y) {
    this.ctx.beginPath();
    var cx = this.cellWidth * y + this.cellWidth;
    var cy = this.cellWidth * x + this.cellWidth;
    this.ctx.arc(cx, cy, this.cellWidth * 0.1, 0, Math.PI * 2);
    this.ctx.fillStyle = "#e73480";
    this.ctx.fill();
  }

  // 是否为空判断
  isEmpty(x, y) {
    if (this.composition[x] && this.composition[x][y] === null) {
      return true;
    } else {
      return false;
    }
  }

  // 是否为敌判断
  isEnemy(x, y, color) {
    if (this.composition[x] && this.composition[x][y] && this.composition[x][y].color != color) {
      return true;
    } else {
      return false;
    }
  }

  // 已选择棋子的移动范围   参数：棋子在棋局中的位置
  getMoveRange(x, y) { //
    this.moveRange = [];
    var moveRange = [];

    var color = this.composition[x] && this.composition[x][y].color;
    var darr; // 需要判断的移动方向
    switch (this.composition[x][y].text) {
      case "車":
      case "车":
        for (let j = 1; j < y + 1; j++) {
          if (this.isEmpty(x, y - j)) {
            moveRange.push({
              x: x,
              y: y - j
            });
          } else {
            if (this.isEnemy(x, y - j, color)) {
              moveRange.push({
                x: x,
                y: y - j
              });
            }
            break;
          }
        }
        for (let j = 1; j < x + 1; j++) {
          if (this.isEmpty(x - j, y)) {
            moveRange.push({
              x: x - j,
              y: y
            });
          } else {
            if (this.isEnemy(x - j, y, color)) {
              moveRange.push({
                x: x - j,
                y: y
              });
            }
            break;
          }
        }
        for (let j = 1; j < 9 - y; j++) {
          if (this.isEmpty(x, y + j)) {
            moveRange.push({
              x: x,
              y: y + j
            });
          } else {
            if (this.isEnemy(x, y + j, color)) {
              moveRange.push({
                x: x,
                y: y + j
              });
            }
            break;
          }
        }
        for (let j = 1; j < 10 - x; j++) {
          if (this.isEmpty(x + j, y)) {
            moveRange.push({
              x: x + j,
              y: y
            });
          } else {
            if (this.isEnemy(x + j, y, color)) {
              moveRange.push({
                x: x + j,
                y: y
              });
            }
            break;
          }
        }
        break;
      case "馬":
      case "马":
        if (this.isEnemyOrEmpty(x + 1, y + 2, color)) {
          if (this.composition[x] && this.composition[x][y + 1] === null) {
            moveRange.push({
              x: x + 1,
              y: y + 2
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 1, y - 2, color)) {
          if (this.composition[x] && this.composition[x][y - 1] === null) {
            moveRange.push({
              x: x + 1,
              y: y - 2
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 2, y + 1, color)) {
          if (this.composition[x + 1] && this.composition[x + 1][y] === null) {
            moveRange.push({
              x: x + 2,
              y: y + 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 2, y - 1, color)) {
          if (this.composition[x + 1] && this.composition[x + 1][y] === null) {
            moveRange.push({
              x: x + 2,
              y: y - 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x - 2, y + 1, color)) {
          if (this.composition[x - 1] && this.composition[x - 1][y] === null) {
            moveRange.push({
              x: x - 2,
              y: y + 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x - 2, y - 1, color)) {
          if (this.composition[x - 1] && this.composition[x - 1][y] === null) {
            moveRange.push({
              x: x - 2,
              y: y - 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x - 1, y + 2, color)) {
          if (this.composition[x] && this.composition[x][y + 1] === null) {
            moveRange.push({
              x: x - 1,
              y: y + 2
            });
          }
        }
        if (this.isEnemyOrEmpty(x - 1, y - 2, color)) {
          if (this.composition[x] && this.composition[x][y - 1] === null) {
            moveRange.push({
              x: x - 1,
              y: y - 2
            });
          }
        }
        break;
      case "象":
      case "相":
        var rowlow, rowup, collow = 0,
          colup = 8; // 行和列的判断上下限
        if (x > 4) { // 下方一边
          rowlow = 5;
          rowup = 9;
        } else { // 上方一边
          rowlow = 0;
          rowup = 4;
        }
        if (x - 2 >= rowlow && y - 2 >= collow) {
          if (this.isEnemyOrEmpty(x - 2, y - 2, color)) {
            if (this.composition[x - 1] && this.composition[x - 1][y - 1] === null) {
              moveRange.push({
                x: x - 2,
                y: y - 2
              });
            }
          }
        }
        if (x - 2 >= rowlow && y + 2 <= colup) {
          if (this.isEnemyOrEmpty(x - 2, y + 2, color)) {
            if (this.composition[x - 1] && this.composition[x - 1][y + 1] === null) {
              moveRange.push({
                x: x - 2,
                y: y + 2
              });
            }
          }
        }
        if (x + 2 <= rowup && y - 2 >= collow) {
          if (this.isEnemyOrEmpty(x + 2, y - 2, color)) {
            if (this.composition[x + 1] && this.composition[x + 1][y - 1] === null) {
              moveRange.push({
                x: x + 2,
                y: y - 2
              });
            }
          }
        }
        if (x + 2 <= rowup && y + 2 <= colup) {
          if (this.isEnemyOrEmpty(x + 2, y + 2, color)) {
            if (this.composition[x + 1] && this.composition[x + 1][y + 1] === null) {
              moveRange.push({
                x: x + 2,
                y: y + 2
              });
            }
          }
        }
        break;
      case "仕":
      case "士":
        var rowlow, rowup, collow = 3,
          colup = 5; // 行和列的判断上下限
        if (x > 4) { // 下方一边
          rowlow = 7;
          rowup = 9;
        } else { // 上方一边
          rowlow = 0;
          rowup = 2;
        }
        if (this.isEnemyOrEmpty(x - 1, y - 1, color)) {
          if (x - 1 >= rowlow && y - 1 >= collow) {
            moveRange.push({
              x: x - 1,
              y: y - 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x - 1, y + 1, color)) {
          if (x - 1 >= rowlow && y + 1 <= colup) {
            moveRange.push({
              x: x - 1,
              y: y + 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 1, y - 1, color)) {
          if (x + 1 <= rowup && y - 1 >= collow) {
            moveRange.push({
              x: x + 1,
              y: y - 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 1, y + 1, color)) {
          if (x + 1 <= rowup && y + 1 <= colup) {
            moveRange.push({
              x: x + 1,
              y: y + 1
            });
          }
        }
        break;
      case "将":
      case "帥":
      case "帅":
        var rowlow, rowup, collow = 3,
          colup = 5; // 行和列的判断上下限
        if (x > 4) { // 下方一边
          rowlow = 7;
          rowup = 9;
        } else { // 上方一边
          rowlow = 0;
          rowup = 2;
        }
        if (this.isEnemyOrEmpty(x - 1, y, color)) {
          if (x - 1 >= rowlow) { // 老将不越上边界
            moveRange.push({
              x: x - 1,
              y: y
            });
          }
        }
        if (this.isEnemyOrEmpty(x + 1, y, color)) {
          if (x + 1 <= rowup) { // 老将不越下边界
            moveRange.push({
              x: x + 1,
              y: y
            });
          }
        }
        if (this.isEnemyOrEmpty(x, y - 1, color)) {
          if (y - 1 >= collow) { // 老将不越左边界
            moveRange.push({
              x: x,
              y: y - 1
            });
          }
        }
        if (this.isEnemyOrEmpty(x, y + 1, color)) {
          if (y + 1 <= colup) { // 老将不越右边界
            moveRange.push({
              x: x,
              y: y + 1
            });
          }
        }
        break;
      case "炮":
      case "砲":
        var count = 0;
        // 上方
        count = 0;
        for (let j = 1; j < y + 1; j++) {
          if (this.composition[x][y - j] === null) {
            if (count === 0) {
              moveRange.push({
                x: x,
                y: y - j
              });
            }
          } else if (this.composition[x][y - j].color) {
            count++;
            if (count === 2 && this.composition[x][y - j].color != color) {
              moveRange.push({
                x: x,
                y: y - j
              });
            }
          }

          if (count >= 2) {
            break;
          }
        }
        // 下
        count = 0;
        for (let j = 1; j < 9 - y; j++) {
          if (this.composition[x][y + j] === null) {
            if (count === 0) {
              moveRange.push({
                x: x,
                y: y + j
              });
            }
          } else if (this.composition[x][y + j].color) {
            count++;
            if (count === 2 && this.composition[x][y + j].color != color) {
              moveRange.push({
                x: x,
                y: y + j
              });
            }
          }

          if (count >= 2) {
            break;
          }
        }
        // 左
        count = 0;
        for (let j = 1; j < x + 1; j++) {
          if (this.composition[x - j][y] === null) {
            if (count === 0) {
              moveRange.push({
                x: x - j,
                y: y
              });
            }
          } else if (this.composition[x - j][y].color) {
            count++;
            if (count === 2 && this.composition[x - j][y].color != color) {
              moveRange.push({
                x: x - j,
                y: y
              });
            }
          }

          if (count >= 2) {
            break;
          }
        }
        // 右
        count = 0;
        for (let j = 1; j < 10 - x; j++) {
          if (this.composition[x + j][y] === null) {
            if (count === 0) {
              moveRange.push({
                x: x + j,
                y: y
              });
            }
          } else if (this.composition[x + j][y].color) {
            count++;
            if (count === 2 && this.composition[x + j][y].color != color) {
              moveRange.push({
                x: x + j,
                y: y
              });
            }
          }

          if (count >= 2) {
            break;
          }
        }
        break;
      case "兵":
      case "卒":
        if (this.bottomColor == color) {
          if (x >= 5) { // 过河前
            if (this.isEnemyOrEmpty(x - 1, y, color)) {
              moveRange.push({
                x: x - 1,
                y: y
              });
            }
          } else { // 过河后
            if (this.isEnemyOrEmpty(x - 1, y, color)) {
              moveRange.push({
                x: x - 1,
                y: y
              });
            }
            if (this.isEnemyOrEmpty(x, y - 1, color)) {
              moveRange.push({
                x: x,
                y: y - 1
              });
            }
            if (this.isEnemyOrEmpty(x, y + 1, color)) {
              moveRange.push({
                x: x,
                y: y + 1
              });
            }
          }
        } else {
          if (x <= 4) { // 过河前
            if (this.isEnemyOrEmpty(x + 1, y, color)) {
              moveRange.push({
                x: x + 1,
                y: y
              });
            }
          } else { // 过河后
            if (this.isEnemyOrEmpty(x + 1, y, color)) {
              moveRange.push({
                x: x + 1,
                y: y
              });
            }
            if (this.isEnemyOrEmpty(x, y - 1, color)) {
              moveRange.push({
                x: x,
                y: y - 1
              });
            }
            if (this.isEnemyOrEmpty(x, y + 1, color)) {
              moveRange.push({
                x: x,
                y: y + 1
              });
            }
          }
        }

        break;
      default:
        console.warn("兵种（%s）不认识", this.composition[x][y].text);
    }
    this.moveRange = moveRange;
    return moveRange;
  }

  // 移动   1.选择需要移动的棋子  2.点击推荐的可以移动的位置  3.之前的位置赋值为空，结束的位置赋值为当前棋子
  move(x, y) {
    this.composition[x][y] = this.toMove.data;
    this.composition[this.toMove.x][this.toMove.y] = null;
    console.log("%c%s", "fontsize: 20px; color:" + this.active + ";", this.chessManual(this.toMove.x, this.toMove.y, x, y, this.toMove.data.text, this.toMove.data.color));
    this.chessSteps.push({
      step: this.chessManual(this.toMove.x, this.toMove.y, x, y, this.toMove.data.text, this.toMove.data.color),
      qijv: this.deepClone(this.composition),
    });
    let mov = xy2move(this.toMove.y, this.toMove.x, y, x);
    game.move(mov);

    this.exchange();
    this.clearChoose();

    this.renderUi();
  }

  // 清除选中的棋子
  clearChoose() {
    delete this.toMove.x;
    delete this.toMove.y;
    delete this.toMove.data;
  }

  // 生成棋谱  // x增大为进减小为退
  chessManual(x0, y0, x1, y1, text, color) { // 马 士 象需要特殊处理
    var res = "";
    var dx = x1 - x0;
    if (color == this.bottomColor) {
      switch (text) {
        case "車":
        case "车":
        case "炮":
        case "砲":
        case "将":
        case "帅":
        case "帥":
        case "兵":
        case "卒":
          if (dx < 0) {
            res = text + this.translateNum(9 - y0) + "进" + this.translateNum(-dx);
          } else if (dx == 0) {
            res = text + this.translateNum(9 - y0) + "平" + this.translateNum(9 - y1);
          } else {
            res = text + this.translateNum(9 - y0) + "退" + this.translateNum(dx);
          }
          break;
        case "马":
        case "馬":
        case "士":
        case "仕":
        case "象":
        case "相":
          if (dx < 0) {
            res = text + this.translateNum(9 - y0) + "进" + this.translateNum(9 - y1);
          } else {
            res = text + this.translateNum(9 - y0) + "退" + this.translateNum(9 - y1);
          }
          break;
        default:
          console.warn("棋子%s无法识别", text);
      }
    } else {
      switch (text) {
        case "車":
        case "车":
        case "炮":
        case "砲":
        case "将":
        case "帅":
        case "帥":
        case "兵":
        case "卒":
          if (dx < 0) {
            res = text + this.translateNum(y0 + 1) + "退" + this.translateNum(-dx);
          } else if (dx == 0) {
            res = text + this.translateNum(y0 + 1) + "平" + this.translateNum(y1 + 1);
          } else {
            res = text + this.translateNum(y0 + 1) + "进" + this.translateNum(dx);
          }
          break;
        case "马":
        case "馬":
        case "士":
        case "仕":
        case "象":
        case "相":
          if (dx < 0) {
            res = text + this.translateNum(y0 + 1) + "退" + this.translateNum(y1 + 1);
          } else {
            res = text + this.translateNum(y0 + 1) + "进" + this.translateNum(y1 + 1);
          }
          break;
        default:
          console.warn("棋子%s无法识别", text);
      }
    }

    return res;
  }

  // 将数组转换成汉字
  translateNum(num) {
    var res = "";
    switch (num) {
      case 0:
        res = "零";
        break;
      case 1:
        res = "一";
        break;
      case 2:
        res = "二";
        break;
      case 3:
        res = "三";
        break;
      case 4:
        res = "四";
        break;
      case 5:
        res = "五";
        break;
      case 6:
        res = "六";
        break;
      case 7:
        res = "七";
        break;
      case 8:
        res = "八";
        break;
      case 9:
        res = "九";
        break;
      default:
        console.warn("请输入0-9的一个整数");
    }
    return res;
  }

  // 深度反转数组
  deepReverse(arr) {
    if (arr instanceof Array) {
      var copy = this.deepClone(arr);
      var reverse = copy.reverse();

      for (var i = 0, len = reverse.length; i < len; i++) {
        if (reverse[i] instanceof Array) {
          reverse[i] = this.deepReverse(reverse[i]);
        }
      }
      return reverse;
    }

    throw new Error("此函数只能反转数组");
  }

  // 深拷贝
  deepClone(values) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == values || "object" != typeof values) return values;

    // Handle Date
    if (values instanceof Date) {
      copy = new Date();
      copy.setTime(values.getTime());
      return copy;
    }

    // Handle Array
    if (values instanceof Array) {
      copy = [];
      for (var i = 0, len = values.length; i < len; i++) {
        copy[i] = this.deepClone(values[i]);
      }
      return copy;
    }

    // Handle Object
    if (values instanceof Object) {
      copy = {};
      for (var attr in values) {
        if (values.hasOwnProperty(attr)) copy[attr] = this.deepClone(values[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy values! Its type isn't supported.");
  }
};
