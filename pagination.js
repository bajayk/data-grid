export default class CPagination extends HTMLElement{

    constructor(){
        super();
        this.shadow = this.attachShadow({mode:'open'});
        this.init();
    }
    
    init(){        
        this.render();
        this.btnPrevious = this.shadow.querySelector('.btn-previous');
        this.btnNext = this.shadow.querySelector('.btn-next');
        this.btnFirst = this.shadow.querySelector('.btn-first');
        this.btnLast = this.shadow.querySelector('.btn-last');
        this.dotsPrevious = this.shadow.querySelector('.dots-previous');
        this.dotsNext = this.shadow.querySelector('.dots-next');
        this.currentPage = 1;
        this.addEventListeners();
    }



    addEventListeners(){
        this.btnPrevious.addEventListener('click', (e)=>this.onPrevious(e));
        this.btnNext.addEventListener('click', (e)=>this.onNext(e));
        this.btnFirst.addEventListener('click', (e)=>this.onFirst(e));
        this.btnLast.addEventListener('click', (e)=>this.onLast(e));
    }


    onFirst(e){
        this.shadow.querySelector('.btn-page.active').classList.remove('active');
        let pageno = 1;
        this.shadow.querySelector('.btn-page[pageno="'+pageno+'"]').classList.add('active');
        this.dispatchEventOnSelectPage(pageno);
        this.currentPage = pageno;
        this.setButtonsVisibility();
    }

    onLast(e){
        this.shadow.querySelector('.btn-page.active').classList.remove('active');
        let pageno = this.btnsCount;
        this.shadow.querySelector('.btn-page[pageno="'+pageno+'"]').classList.add('active');
        this.dispatchEventOnSelectPage(pageno);
        this.currentPage = pageno;
        this.setButtonsVisibility();
    }

    onPrevious(e){

        if(this.currentPage === 1){
            return;
        }

        this.shadow.querySelector('.btn-page.active').classList.remove('active');
        let pageno = this.currentPage - 1;
        this.shadow.querySelector('.btn-page[pageno="'+pageno+'"]').classList.add('active');
        this.dispatchEventOnSelectPage(pageno);
        this.currentPage = pageno;
        this.setButtonsVisibility();
    }

    onNext(e){
        if(this.currentPage >= this.btnsCount){
            return;
        }

        this.shadow.querySelector('.btn-page.active').classList.remove('active');
        let pageno = this.currentPage + 1;
        this.shadow.querySelector('.btn-page[pageno="'+pageno+'"]').classList.add('active');
        this.dispatchEventOnSelectPage(pageno);
        this.currentPage = pageno;
        this.setButtonsVisibility();
    }

    generateButtons(data, entries){
        this.shadow.querySelectorAll(".btn-page").forEach(ele => {
            ele.parentNode.removeChild(ele);
        });

        this.btnsCount = Math.floor(data.length / entries);// No of button counts requirement
        
    
        for(let i=1; i <= this.btnsCount; i++){
            let page = document.createElement('div');
            page.classList.add('btn');
            page.classList.add('btn-page');            

            if(i === 1){
                page.classList.add('active');
            }

            if( i > 5){
                page.classList.add('hide');
            }

            page.setAttribute('pageno', i);

            page.innerHTML = i;

            page.addEventListener('click', (e)=>this.onPageClick(e));

            this.dotsNext.parentNode.insertBefore(page, this.dotsNext);

        }

        this.currentPage = 1;

        this.setButtonsVisibility();
        
    }

    onPageClick(e){
        this.shadow.querySelector('.btn-page.active').classList.remove('active');
        e.target.classList.add('active');
        let pageno = parseInt(e.target.getAttribute('pageno'));
        this.dispatchEventOnSelectPage(pageno);
        this.currentPage = pageno;
        this.setButtonsVisibility();
    }

    setButtonsVisibility(){
        if(this.currentPage === 1){
            this.btnFirst.classList.add('hide');
            this.btnPrevious.classList.add('hide');            
        }else{
            this.btnFirst.classList.remove('hide');
            this.btnPrevious.classList.remove('hide');            
        }

        if(this.currentPage < 4){          
            this.dotsPrevious.classList.add('hide');
        }else{           
            this.dotsPrevious.classList.remove('hide');
        }

        if(this.currentPage >= this.btnsCount){
            this.btnLast.classList.add('hide');
            this.btnNext.classList.add('hide');            
        }else{
            this.btnLast.classList.remove('hide');
            this.btnNext.classList.remove('hide');           
        }


        if(this.currentPage >= this.btnsCount - 2){
           
            this.dotsNext.classList.add('hide');
        }else{
           
            this.dotsNext.classList.remove('hide');
        }
        
        if(this.btnsCount > 5 ){ //&& this.currentPage > 2 && this.currentPage < this.btnsCount - 1
            

            let btns = this.shadow.querySelectorAll('.btn-page');

            btns.forEach(btn => {
                btn.classList.add('hide');
            });

            let start;

            if(this.currentPage > 2 && this.currentPage <= this.btnsCount - 2){
                start = this.currentPage - 3;
            }else if(this.currentPage > this.btnsCount - 2){
                start = this.btnsCount - 5;
            }else{
                start = 0;
            }

            for(let i=start; i < start + 5; i++){
                btns[i].classList.remove('hide');
            }

        }
    }

    dispatchEventOnSelectPage(pageno){

        let event = new CustomEvent('onPageChange', {
            detail:{
                pageno:pageno
            }
        });
        
        this.dispatchEvent(event);
    }

    render(){
        this.shadow.innerHTML = `
        <style>
        .pagination{
            font-size:14px;
            display:flex;
            justify-content:space-between;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        }

        .buttons{
            display:flex;
        }

        .buttons .btn{
            
            padding:4px 8px;
            cursor:pointer;
            margin:2px;       
            box-sizing: border-box;           
            border-radius:3px;
            border:white solid 1px;
        }

        
        .buttons .btn:hover{
            background: linear-gradient(to bottom, #aaa 0%, #111 100%);
            border:#111 solid 1px;
            color:white;
        }
        
        .buttons .btn.active{
            background: linear-gradient(to bottom, #fff 0%, #dcdcdc 100%);
            border:lightgray solid 1px;
            color:black;
        }

        .buttons .btn.hide, .buttons .dots.hide{
           display:none;
        }

        .page-views{
            padding:8px 0px;
        }

        .buttons .dots{
            padding-top:4px;
        }

        </style>
        <div class="pagination">
            <div class="page-views">
                Showing 1 to 10 of 37 entries
            </div>
            <div class="buttons">
                <div class="btn btn-first">First</div>
                <div class="btn btn-previous">Previous</div>
                <div class="dots dots-previous">...</div>
                <div class="btn btn-page">1</div>
                <div class="btn btn-page active">2</div>
                <div class="btn btn-page">3</div>
                <div class="btn btn-page">4</div>
                <div class="dots dots-next">...</div>
                <div class="btn btn-next">Next</div>
                <div class="btn btn-last">Last</div>
            </div>
        </div>
        `;
    }

    

}

customElements.define('c-pagination', CPagination);