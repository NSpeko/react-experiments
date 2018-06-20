import '../DataTables/datatables.min.css';
import React, { Component } from 'react';
import LineChart from 'react-linechart';
import '../DataTables/select.dataTables.css' ;
import randomColor from "randomcolor";
const $ = require('jquery');
let data=[{
    color: "steelblue",
    points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}]
}];
let chart=<LineChart
    showLegends={true}
    legendPosition={"top-right"}
    xLabel={"Tasks number"}
    yLabel={"Tasks time"}
    width={600}
    height={400}
    data={data}
/>;
$.DataTable = require('datatables.net');
$.DataTableSelect = require('datatables.net-select');

export class Tables extends Component {

    constructor(props){
        super(props);

        this.state = {
            dataSet: props.data
        };

        this.setTableRef = (table) => {
            this.tableRef = table;
        }
    }

    fillTable(){
        let dataSet =[];
        // if(this.state.dataSet.length === 195){
            for (let i = 0; i < this.state.dataSet.length; i++) {
                let tempPuzzleNames=Object.keys(this.state.dataSet[i].puzzleScores);
                let tempArrayForDataSet=['',this.state.dataSet[i].userName];
                for(let j=0;j<tempPuzzleNames.length;j++){
                    tempArrayForDataSet.push(

                        `<div class="tooltip"> ${ this.state.dataSet[i].puzzleScores[tempPuzzleNames[j]].time }<span class="tooltiptext">${ this.state.dataSet[i].puzzleScores[tempPuzzleNames[j]].code }</span></div>`
                    )
                }
                tempArrayForDataSet.push(this.state.dataSet[i].fullTime);
                dataSet.push(tempArrayForDataSet);
                // dataSet.push(
                //     [
                //         '',
                //         this.state.dataSet[i].userName,
                //         `<div class="tooltip"> ${ this.state.dataSet[i].puzzleScores['Bits and Pieces'].time }<span class="tooltiptext">${ this.state.dataSet[i].puzzleScores['Bits and Pieces'].code }</span></div>`,
                //         this.state.dataSet[i].fullTime
                //     ]
                // );
            }
        // }else {
        //     for (let i = 0; i < this.state.dataSet.length; i++) {
        //         dataSet.push(
        //             [
        //                 '',
        //                 this.state.dataSet[i].userName,
        //                 this.state.dataSet[i].puzzleScores.Anchor.time,
        //                 this.state.dataSet[i].puzzleScores['Articles Everywhere'].time,
        //                 this.state.dataSet[i].puzzleScores.Classy.time,
        //                 this.state.dataSet[i].puzzleScores['Envious Heirs'].time,
        //                 this.state.dataSet[i].puzzleScores['Linear'].time,
        //                 this.state.dataSet[i].puzzleScores['Mariana'].time,
        //                 this.state.dataSet[i].puzzleScores['Matching Game'].time,
        //                 this.state.dataSet[i].puzzleScores['Matching Game II'].time,
        //                 this.state.dataSet[i].puzzleScores['Signing Up'].time,
        //                 this.state.dataSet[i].puzzleScores['Tech Stack'].time,
        //                 this.state.dataSet[i].fullTime
        //             ]
        //         );
        //     }
        // }
        return dataSet;
    }

    setColumNames(){
        console.log(this.state.dataSet[0].puzzleScores);
        let columns = [
            { title: 'Comparison' },
            { title: 'User Name' }
        ];
        Object.keys(this.state.dataSet[0].puzzleScores).forEach( (item)=>{
                columns.push({title: item, orderable:false});
            }
        );
        columns.push({title: 'summary'});
        return columns;
    }

    reDrawTable(){
        console.log($('.a1'));
        console.log(this.state.dataSet.length);
        this.table = $(this.tableRef).DataTable(
            {
                data: this.fillTable(),
                columns: this.setColumNames(),
                dom: 'Bfrtip',
                lengthChange: false,
                pageLength: 12,
                tableTools: {
                    sSwfPath: "/swf/copy_csv_xls_pdf.swf"
                },
                oLanguage: {
                    sSearch: "Поиск:"
                },
                columnDefs: [ {
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0,
                    width: "10%",
                },
                ],
                select: {
                    style: 'multi',
                    selector: 'td:first-child'

                },
            }
        );

        this.table.on( 'user-select',  ( e, dt, type, indexes, originalEvent ) =>{
            const k = originalEvent.target.parentElement.classList.contains('selected');
            if(this.table.rows( '.selected' ).count() > 9  && !k) {
                e.preventDefault();
            }
            let that=this;
            setTimeout(function () {
                let tempData=[];
                for(let i=0;i<that.table.rows( '.selected' ).data().length;i++){
                    let tempDataSet=that.table.rows( '.selected' ).data()[i].slice(1,that.table.rows( '.selected' ).data()[i].length-1);
                    console.log(tempDataSet);
                    let tempPoints=[];
                    for(let j=1;j<tempDataSet.length;j++){
                        tempPoints.push(
                            {
                                x:j,
                                y:Number.parseInt(tempDataSet[j].slice(21,tempDataSet[j].length)),
                            }
                        )
                    }
                    tempData.push({
                        id:tempDataSet[0],
                        showLegends:true,
                        color:randomColor(),
                        points:tempPoints
                    })
                }
                chart=<LineChart
                    showLegends={true}
                    legendPosition={"top-right"}
                    xLabel={"Tasks number"}
                    yLabel={"Tasks time"}
                    width={600}
                    height={400}
                    data={tempData}/>;
                console.log(tempData);
                that.forceUpdate();
            });
        } );


        this.table.on( 'deselect',  (e) =>{
            // console.log(Number.parseInt(this.table.rows( '.selected' ).data()[0][2].slice(21,this.length)));
            // globalChartData.push(Number.parseInt(this.table.rows( '.selected' ).data()[0][2].slice(21,this.length)));
            if(this.table.rows( '.selected' ).count() > 9){
                e.stopImmediatePropagation();
            }
        } );
    }

    componentDidMount(){
       this.reDrawTable();
    }
    /*componentWillReceiveProps(props) {
        console.log("change");
        this.setState({dataSet: props.data});
        /!*console.log(this.state.dataSet);
        this.forceUpdate();
        this.createTable();*!/
        this.reloadTableData(this.state.dataSet);
    }*/

    componentWillUnmount(){
    }

    reloadTableData(data) {
        this.table.clear();
        this.table.destroy();
        this.forceUpdate();

        //this.table.rows.add(data);
        this.reDrawTable(data);
        this.table.draw();
    }


    shouldComponentUpdate(nextProps) {
        console.log('shouldComponentUpdate');

        this.state = {
            dataSet: nextProps.data
        };
        this.reloadTableData(nextProps.data);
        return false;
    }

    render(){
        return(<div>
                <table className="display a1" width="100%" ref={this.setTableRef} />
                <div>{chart}</div>
            </div>)
    }
}
export default chart;
