class classTail {
    Type = 0;
    Horizontal = 0;
    Vertical = 0;
    ImagePath = "";
    ImageObj = null;

    constructor(nType, nHorizontal, nVertical) {
        this.Type = nType;
        this.Horizontal = nHorizontal;
        this.Vertical = nVertical;

        if (this.Type < TailTypeCount) {
            this.ImagePath = TailTypeImage[this.Type];
        }
        else {
            this.ImagePath = TailTypeImage[TailTypeCount];
        }

        this.ImageObj = new Image();
        this.ImageObj.src = this.ImagePath;

        this.ImageObj.addEventListener('load', () => {

            let posHorizontal = TailAreaHorizontal + this.Horizontal * TailImageSize;
            let posVertical = TailArealVertical + this.Vertical * TailImageSize;

            ctx.drawImage(this.ImageObj, posHorizontal, posVertical, TailImageSize, TailImageSize);
        });
    }

    Refresh(nType) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.RefreshSync(nType);
                resolve(true);
            }, 64);
        });
    }

    RefreshSync(nType) {
        this.Type = nType;
        if (this.Type < TailTypeCount) {
            this.ImagePath = TailTypeImage[this.Type];
        }
        else {
            this.ImagePath = TailTypeImage[TailTypeCount];
        }

        let posHorizontal = TailAreaHorizontal + this.Horizontal * TailImageSize;
        let posVertical = TailArealVertical + this.Vertical * TailImageSize;

        let xPosition = TailImageSize;
        let yPosition = TailImageSize;

        this.ImageObj.src = this.ImagePath;
        ctx.drawImage(this.ImageObj, posHorizontal, posVertical, xPosition, yPosition);
    }
}