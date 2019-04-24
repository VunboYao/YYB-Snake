class Map {
    constructor(param = {}) {
        this.width = param.width || 600;
        this.height = param.height || 600;
        this.bgColor = param.bgColor || '#ddd';

        let oMap = document.createElement('div');
        oMap.style.position = 'relative';
        oMap.style.width = parseInt(this.width) + 'px';
        oMap.style.height = parseInt(this.height) + 'px';
        oMap.style.background = this.bgColor;

        document.body.appendChild(oMap);
        return oMap;
    }
}