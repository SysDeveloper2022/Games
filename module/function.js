//Инициализаиция тайлов и начальныйх параметров/заполнение матрицы тайлов
function InitTail() {
    TailMixingCount = 3;
    TailMixingUsed = 0;

    TailBonusCount = 300;
    TailBonusUsed = 0;

    TailRequestCount = 100;
    TailRequestUsed = 0;

    TailCells = Array(HorizontalTail).fill().map(() => Array(VerticalTail).fill(0));
    TailCellsErase = [];
    TailCellsReverse = [];
    TailCellsHistory = [];

    let nPosBombTail = getRandomNumber(0, HorizontalTail * VerticalTail);
    let nHorizontalBombTail = (nPosBombTail + 1) % HorizontalTail > 0 ? (nPosBombTail + 1) % HorizontalTail - 1 : VerticalTail - 1;
    let nVerticalBombTail = Math.ceil((nPosBombTail + 1) / HorizontalTail) - 1;

    for (let i = 0; i < HorizontalTail; i++) {
        for (let j = 0; j < VerticalTail; j++) {
            if (i == nHorizontalBombTail && j == nVerticalBombTail) {
                TailCells[nHorizontalBombTail][nVerticalBombTail] = new classTail(TailBomb, i, j);
            } else {
                TailCells[i][j] = new classTail(getRandomNumber(1, TailTypeCount - 1), i, j);
            }
        }
    }

    RefreshTailScope();
    RefreshTailBonus();
}

function RefreshTailScope(){
    ctx.drawImage(TailAreaScopeImage, 450, 132, 205, 192);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic Bold 18pt Arial";
    let cTextPolygon = TailRequestUsed.toString().trim() + "/" + TailRequestCount.toString().trim();
    let dTxetPoligonCenter = getTextPolygonCenterAligman(cTextPolygon, TAIL_VIEW_REQUEST_POLYGON);
    ctx.fillText(cTextPolygon, dTxetPoligonCenter[0], dTxetPoligonCenter[1]);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic Bold 18pt Arial";
    cTextPolygon = TailBonusUsed.toString().trim() + "/" + TailBonusCount.toString().trim();
    dTxetPoligonCenter = getTextPolygonCenterAligman(cTextPolygon, TAIL_VIEW_BONUS_POLYGON);
    ctx.fillText(cTextPolygon, dTxetPoligonCenter[0], dTxetPoligonCenter[1]);
}

function RefreshTailBonus(){
    ctx.drawImage(TailAreaMixedImage, 435, 370, 72, 71);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic Bold 18pt Arial";
    cTextPolygon = (TailMixingCount - TailMixingUsed).toString().trim();
    dTxetPoligonCenter = getTextPolygonCenterAligman(cTextPolygon, TAIL_VIEW_MIXED_POLYGON);
    ctx.fillText(cTextPolygon, dTxetPoligonCenter[0], dTxetPoligonCenter[1]);
}

// Перерисовка тайлов из истории асинхронно
async function RefreshTailHistory() {
    for (let i = 0; i < TailCellsHistory.length; i++) {
        await TailCellsHistory[i][0].Refresh(TailCellsHistory[i][1]);
    }
    TailCellsHistory.splice(0, TailCellsHistory.length);
}

// Перерисовка тайлов из истории асинхронно
function RefreshTailHistorySync() {
    for (let i = 0; i < TailCellsHistory.length; i++) {
        TailCellsHistory[i][0].RefreshSync(TailCellsHistory[i][1]);
    }
    TailCellsHistory.splice(0, TailCellsHistory.length);
}

//Размешивание массива
function MixedTail() {
    let nMinMixedValue = 1;
    let nMaxMixedValue = HorizontalTail * VerticalTail;

    let TailCellsMixed = Array.from(Array(nMaxMixedValue).keys());

    for (i = 1; i <= nMaxMixedValue / 2; i++) {
        let nFirstTail = getRandomNumber(0, TailCellsMixed.length);
        let nSecondTail;

        do {
            nSecondTail = getRandomNumber(0, TailCellsMixed.length);
        } while (nSecondTail == nFirstTail);

        let nVerticalFirstTail = Math.ceil((TailCellsMixed[nFirstTail] + 1) / HorizontalTail) - 1;
        let nHorizontalFirstTail = (TailCellsMixed[nFirstTail] + 1) % HorizontalTail > 0 ? (TailCellsMixed[nFirstTail] + 1) % HorizontalTail - 1 : HorizontalTail - 1;

        let nVerticalSecondTail = Math.ceil((TailCellsMixed[nSecondTail] + 1) / HorizontalTail) - 1;
        let nHorizontalSecondTail = (TailCellsMixed[nSecondTail] + 1) % HorizontalTail > 0 ? (TailCellsMixed[nSecondTail] + 1) % HorizontalTail - 1 : HorizontalTail - 1;

        let oFirstTail = TailCells[nHorizontalFirstTail][nVerticalFirstTail];
        let oSecondTail = TailCells[nHorizontalSecondTail][nVerticalSecondTail];

        TailCells[nHorizontalFirstTail][nVerticalFirstTail] = oSecondTail;
        TailCells[nHorizontalSecondTail][nVerticalSecondTail] = oFirstTail;

        oFirstTail.Horizontal = nHorizontalSecondTail;
        oFirstTail.Vertical = nVerticalSecondTail;

        oSecondTail.Horizontal = nHorizontalFirstTail;
        oSecondTail.Vertical = nVerticalFirstTail;

        if (nFirstTail > nSecondTail) {
            TailCellsMixed.splice(nFirstTail, 1);
            TailCellsMixed.splice(nSecondTail, 1);
        } else {
            TailCellsMixed.splice(nSecondTail, 1);
            TailCellsMixed.splice(nFirstTail, 1);
        }

        TailCellsHistory.push(new Array(oFirstTail, oFirstTail.Type));
        TailCellsHistory.push(new Array(oSecondTail, oSecondTail.Type));
    }
}

//Ракировка тайлов
function ReverseTail(oFirstTail, oSecondTail) {
    let lReversTail = false;

    let nFirstTailType = oFirstTail.Type;
    let nSecondTailType = oSecondTail.Type;

    let nHorizontalRevers = Math.abs(oFirstTail.Horizontal - oSecondTail.Horizontal);
    let nVerticalRevers = Math.abs(oFirstTail.Vertical - oSecondTail.Vertical);

    if ((nHorizontalRevers == 1 && nVerticalRevers == 0) || (nHorizontalRevers == 0 && nVerticalRevers == 1)) {
        oFirstTail.Type = nSecondTailType;
        oSecondTail.Type = nFirstTailType;

        lReversTail = true;

        TailCellsHistory.push(new Array(oFirstTail, nSecondTailType));
        TailCellsHistory.push(new Array(oSecondTail, nFirstTailType));
    }
    else {
        lReversTail = false;
    }
    return lReversTail;
}

//Обнуление тайлов методом "Бомбочка"
function EraseTailBomb(oTailBomb) {
    let nStartHorizontal = oTailBomb.Horizontal - TailBombRadius <= 0 ? 0 : oTailBomb.Horizontal - TailBombRadius;
    let nStartVertical = oTailBomb.Vertical - TailBombRadius <= 0 ? 0 : oTailBomb.Vertical - TailBombRadius;

    let nEndHorizontal = oTailBomb.Horizontal + TailBombRadius >= HorizontalTail - 1 ? HorizontalTail - 1 : oTailBomb.Horizontal + TailBombRadius;
    let nEndVertical = oTailBomb.Vertical + TailBombRadius >= VerticalTail - 1 ? VerticalTail - 1 : oTailBomb.Vertical + TailBombRadius;

    for (let i = nStartHorizontal; i <= nEndHorizontal; i++) {
        for (let j = nStartVertical; j <= nEndVertical; j++) {
            TailCells[i][j].Type = TailEmpty;

            TailBonusUsed = TailBonusUsed + 1;
            TailCellsHistory.push(new Array(TailCells[i][j], TailEmpty));
        }
    }
}

//Обнуление тайлов рекурсивная функция
function EraseTail(oTail, lEraseTails) {
    if (oTail.Type != TailEmpty) {
        TailCellsErase.push(oTail);

        //Напрaвление ввер по верикали
        if (oTail.Vertical - 1 >= 0) {
            let oTailTop = TailCells[oTail.Horizontal][oTail.Vertical - 1];

            if (oTail.Type == oTailTop.Type && !TailCellsErase.includes(oTailTop)) {
                TailCellsErase.push(oTailTop);
                EraseTail(oTailTop, false)
            }
        }

        //Напровление вниз по верикали
        if (oTail.Vertical + 1 <= VerticalTail - 1) {
            let oTailBottom = TailCells[oTail.Horizontal][oTail.Vertical + 1];

            if (oTail.Type == oTailBottom.Type && !TailCellsErase.includes(oTailBottom)) {
                TailCellsErase.push(oTailBottom);
                EraseTail(oTailBottom, false)
            }
        }

        //Напровление влево по горизонтали
        if (oTail.Horizontal - 1 >= 0) {
            let oTailLeft = TailCells[oTail.Horizontal - 1][oTail.Vertical];

            if (oTail.Type == oTailLeft.Type && !TailCellsErase.includes(oTailLeft)) {
                TailCellsErase.push(oTailLeft);
                EraseTail(oTailLeft, false)
            }
        }

        //Напровление вправо по горизонтали
        if (oTail.Horizontal + 1 <= HorizontalTail - 1) {
            let oTailRight = TailCells[oTail.Horizontal + 1][oTail.Vertical];

            if (oTail.Type == oTailRight.Type && !TailCellsErase.includes(oTailRight)) {
                TailCellsErase.push(oTailRight);
                EraseTail(oTailRight, false);
            }
        }

        if (lEraseTails) {

            let TailCellsEraseUniquie = Array.from(new Set(TailCellsErase));

            if (TailCellsEraseUniquie.length >= TailMinCount) {
                for (let i = 0; i < TailCellsEraseUniquie.length; i++) {
                    TailCellsEraseUniquie[i].Type = TailEmpty;

                    TailBonusUsed = TailBonusUsed + 1;
                    TailCellsHistory.push(new Array(TailCellsEraseUniquie[i], TailEmpty));
                }
            }
            TailCellsErase.splice(0, TailCellsErase.length);
        }
    }
}

//Перемещение тайлов
function MoveTail() {
    let lMoveTail = false;
    for (let i = 0; i < HorizontalTail; i++) {

        for (let j = 0; j < VerticalTail; j++) {
            oEraseTail = TailCells[i][j];

            if (oEraseTail.Vertical - 1 >= 0 && oEraseTail.Type == TailEmpty) {
                if (TailCells[oEraseTail.Horizontal][oEraseTail.Vertical - 1].Type != TailEmpty) {

                    oEraseTail.Type = TailCells[oEraseTail.Horizontal][oEraseTail.Vertical - 1].Type;
                    TailCells[oEraseTail.Horizontal][oEraseTail.Vertical - 1].Type = TailEmpty;

                    TailCellsHistory.push(new Array(oEraseTail, oEraseTail.Type));
                    TailCellsHistory.push(new Array(TailCells[oEraseTail.Horizontal][oEraseTail.Vertical - 1], TailEmpty));

                    lMoveTail = true;
                }
            }
        }
        if (GenerationTail()) {
            lMoveTail = true;
        }
    }

    if (lMoveTail) {
        MoveTail();
    }

    return lMoveTail;
}

//Генерация тайлов первой строки
function GenerationTail() {
    let lGenereationTail = false;

    let nPosBombTail = getRandomNumber(0, HorizontalTail * VerticalTail);
    let nHorizontalBombTail = (nPosBombTail + 1) % HorizontalTail > 0 ? (nPosBombTail + 1) % HorizontalTail - 1 : VerticalTail - 1;
    let nVerticalBombTail = Math.ceil((nPosBombTail + 1) / HorizontalTail) - 1;

    for (let i = 0; i < HorizontalTail; i++) {

        if (TailCells[i][0].Type == TailEmpty) {

            if (i == nHorizontalBombTail && nHorizontalBombTail == 0) {
                TailCells[i][0].Type = TailBomb;
            } else {
                TailCells[i][0].Type = getRandomNumber(1, TailTypeCount - 1);
            }

            lGenereationTail = true

            TailCellsHistory.push(new Array(TailCells[i][0], TailCells[i][0].Type));
        }
    }
    return lGenereationTail;
}

//Генерация случайного числа в заданном промежутке
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Определения действия на событие Click Canvas
function getTailPolygonAction(x, y){
    let nTailPolygonAction = TAIL_UNDIFINED_ACTION;

    for (i = 0; i < TailPolygonAction.length; i++){
        let TailDefinedAction = TailPolygonAction [i];

        if (x >= TailDefinedAction[1][0][0] && x <= TailDefinedAction[1][1][0] &&
            y >= TailDefinedAction[1][0][1] && y <= TailDefinedAction[1][1][1]){
            
            nTailPolygonAction = TailDefinedAction[0];
            break;
        }
    }
    return nTailPolygonAction;
}

//Определения координат отрисовки текста по полигону
function getTextPolygonCenterAligman(cText, TextPolygonSize){
    let nSymbolSizeX = 14;
    let nSymbolSizeY = 19;

    let nSymbolPositionX = TextPolygonSize[1][0] - (TextPolygonSize[1][0] - TextPolygonSize[0][0])/2 - (cText.length * nSymbolSizeX)/2;
    let nSymbolPositionY = TextPolygonSize[1][1] - (TextPolygonSize[1][1] - TextPolygonSize[0][1])/2 - nSymbolSizeY/2;

    return [nSymbolPositionX, nSymbolPositionY];
}