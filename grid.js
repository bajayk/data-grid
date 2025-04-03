export default class CGrid extends HTMLElement{

    constructor(){
        super();
        this.shadow = this.attachShadow({mode:'open'});
        this.render();        
    }

    set data(data){
        this._data = data;       
        this._rowData = this._data.rowData;
        // set default values
        this.renderColumns();
        this.entriesPerPage(10);     
    }

    get data(){
        return this._data;        
    }

    entriesPerPage(entries = 10){
        this.startRow = 1;        
        this.noOfEntriesPerPage = (this.data.entriesPerPage || entries);
        this.endRow = this.noOfEntriesPerPage <= this.data.rowData.length ? this.noOfEntriesPerPage : this.data.rowData.length;
        this.dispatchEventOnUpdate();
        this.renderRows();
    }    

    filter(query){
        query = query.toLowerCase();
        this._rowData = this.data.rowData.filter(row => {

                return this.data.columnDefs.reduce((boolean, column) => {                    
                    let field = row[column.field];                    
                    return boolean || field.toString().toLowerCase().indexOf(query) > -1;
                    
                }, false);           

        });  
        this.dispatchEventOnUpdate();  
        this.renderRows();
    }
    
    

    renderColumns(){
        let tHead = this.shadow.querySelector('table thead');        
        tHead.innerHTML = "";
        let tHeadTr = document.createElement('tr');
        tHead.append(tHeadTr);
        
        let tFoot = this.shadow.querySelector('table tfoot');
        tFoot.innerHTML = "";
        let tFootTr = document.createElement('tr');
        tFoot.append(tFootTr);
        
        this.data.columnDefs.forEach(column => {
            let thH = document.createElement('th');
            thH.innerHTML = column.label;
            thH.className = column.field;
            tHeadTr.append(thH);

            let thF = document.createElement('th');
            thF.innerHTML = column.label;
            thF.className = column.field;

            tFootTr.append(thF);
        });
    }

    renderRows(){

        let startIndex = this.startRow - 1;
        let endIndex;
        if(this.endRow <= this._rowData.length){
            endIndex = this.endRow - 1;
        }else{
            endIndex = this._rowData.length - 1;
        }



        let tBody = this.shadow.querySelector('table tbody');
        tBody.innerHTML = "";
         for(let i=startIndex; i <= endIndex; i++){
            let row = this._rowData[i];
            
             let tr = document.createElement('tr');

            this.data.columnDefs.forEach((column) => {
                let td = document.createElement('td');
                td.innerHTML = row[column.field];
                tr.append(td);
            });

            tBody.append(tr); 
        } 
    }

    dispatchEventOnUpdate(){
        let event = new CustomEvent("update", {
            detail:{
                data:this._rowData
            }
        });
        this.dispatchEvent(event);
    }

    showPage(pageno){
        console.log(pageno);
        this.endRow = this.noOfEntriesPerPage * pageno;
        this.startRow = this.endRow - this.noOfEntriesPerPage + 1;

        this.renderRows();
    }

    render(){
        this.shadow.innerHTML = `
        <style>
        table{
            border-width: 0px;
            border-collapse: collapse;
            width: 100%;
        }
        
        td, th{              
            padding:10px;
            text-align:left;
        }

        thead tr th{
            cursor: pointer;
            background-repeat: no-repeat;
            background-position: center right;
        }

        thead tr th.descending{
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACbklEQVR42mNkwAOE1QxZGBkZ/r+5ef4vLjWMuCQkjR1YlSLKlzP+//f7/uq+2Ken9/4h2gA5c1c2xbDilczS6gFMzMwMfx5fW3NvzcSoR8e2/yZogKyxPbt6VNkaDgVdHwYmRobff/4BVQH98eLOhjurJ4bfO7jxF04D5M1dOVXDCtaxSqt5sDCzMDCzMDOAXPDzN9D1jEwMv59c33Jn1YSQe0e2/cQwQMHSjUspKG8js7iiCysLCwM7OxsDOxsbAwvQkH9AZd9//mYAheSf53d23F49Mej2vvXf4QZIGzlwKwVmb2GRUHZgZWVl4ObiYOAAGsDExAR2ASOQBhkAMujPfwaGf68e7L63YVrA1W3LvjHKmTnzSnumbmEUlbfjYGNl4OBgY+Dh5GTgYGP5/xfoeSYmZrBXfvz6w/D733+Gf8Dw+PsfFLcP911f3OHHqB2Q6sVjG7WRmZWVBWQrDycHA+vr24uZuPiN2SUUtUCuABn28tLRNWyq5qF/gJqBBgPh/z9v9yz0AntBP6Ight8ycD4LGxsLx+tb8x7uX5uqHZpzgV1CQRfkAnYW5v/nZtdxyzuFzPwnrR3L8P/fn8+nt8Xu6cpfAQ9E4+iiWAFZFaur62Zkv7h16V/Y1J2XOMTldUH+Z2Fi+LenLpbj798/f43iSmf+ePN8767uwhV4U2Lo5K2XOMTkdEHRx8rM9G9vYzzHw0unCCckGAjs23iJHWgAyAVAL/zb35JEmgF+3esuMQvLgMOAk53l3+G2FI6Hl08Tb4BP5xqoAUxgA460p3E8unKGeAM0bNyVWNmBcQpU8R8IruzdeB2bOgCJEeA1Wr4DVQAAAABJRU5ErkJggg==);
        }

        thead tr th.ascending{
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACfklEQVR42mNkwAJ4JOSZBLQsNRkYGBn+///P8P/3j2/Pjmy4j00tIzZBQSUdfvH0KR/+/PnD8O/fXwbGDy+O3+2NtyLaACFlXX6Z7OkQA/7+Y2D8+Pz49Y5o4g0QUdXjV8qf/eE32ACICy40hxFvgIS6Ab92+YIPP37+Yvjz+w8DA9AFJ2uD8RtgUdCXzC0mY3htWU8u49/ffKZ1yz/8Adr+69cvhp+vHh8/VOFnJaKqzyznmzH31+vHW64sblsDN8C6eGIyr6n3LGYmRqa/d8/MfnF0U4VqQuPbvyDnA+V/vX50/O6mWXaCJp5LfoqqhP/99fP376v7o64salvDaJPTFsBnH7WWkZGRiYXxPwMIAw1ZI6RtEQKMQWAs/GP4+/rR2Y9vXz/4LiAX/A3orV+//jD8/f3z999zW9wZVe19+DRiKrYxiSpYszBADODhYGVgZWIERyEoFpiAqeH952+MX3/8ZPjx8zfD958/GRhePdj5eNvsQLAXlCzdeA2Sa7ewiCvZcbAwMXCxsYA0MTD+/8fwH+iC33/+Mnz9/oPhCxD/ANr+59mtbbfWTgl+cv7wD3ggKps7cpumN23mklV3BBnCDDQAhP9BDfj09TvDtx/AWHl+e9PFJV1hj84f/YkRjRq2HlzWGQ0b2KXVXFkY/jEwA70D8sJPYFSCDPj95Ma6C8v6I2+f2PsLZzpQt3DisMtuWs8uq+kB8gIoJr4DA+773QurTi7oir5/7sgfgglJxciK3T63dQ2TjJYPKCX+eXh56eEZDfH3zh//S1RKBAE1cwc264zGVf9+//x4bE5r0u1TB/9iU4fTABCQVtdlBcbg36e3rvzDpQYAPblA7Rb3v6gAAAAASUVORK5CYII=);
        }


        td{
            border-top: solid 1px #ddd;
        }

        tr:nth-child(odd) td.sorted{
            
            background-color:#f8f8f8;
        }
        tr:nth-child(even) td.sorted{
            background-color:#fafafa;
        }

        tr:first-child td{
            border-top: solid 1px black;
        }

        tr:last-child td{
            border-bottom: solid 1px black;
        }

        tr:nth-child(odd) td{
            background-color:#fdfdfd;
        }

        tr:hover td{
            background-color:#fafafa;
        }

        </style>
        <table>
            <thead></thead>
            <tbody></tbody>
            <tfoot></tfoot>
         </table>
        `;
        
    }

    

}

customElements.define('c-grid', CGrid);