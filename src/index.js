import React from 'react';
import ReactDOM from 'react-dom';


var Hello = React.createClass({
    getInitialState: function() {
        return {show: false};
    },
    render: function() {
        console.log('render',this.props.name);
        const innerJSX = this.state.show ? (
        <div>
            <p>inner shit</p>
            <p> Hello {this.props.name} </p>
            </div>
            ) : null;
    
        return <div className="Item">
            {innerJSX}
        </div>;
    },

    setShow: function(state) {
        this.setState({
            show: state
        });
    }
});


var List = React.createClass({
    getInitialState: function() {
        return {list: []};
    },
   render: function () {
       //const list = [];
       for (let i=0; i < 20; i++) {
           this.state.list.push(
              <Hello name={'World'+i} key={i} ref={'item'+i} />
           );
       }
       console.log('render list ');
       return (
           <div className="List">
               <button onClick={this._hideItem}>Hide</button>
               <button onClick={this._showItem}>Show</button>
               {this.state.list}
           </div>
       );
   },

    _hideItem: function() {
        console.time('hide');
       this.refs.item2.setShow(false);
        console.timeEnd('hide');
    },
    _showItem: function() {
        console.time('show');
       this.refs.item2.setShow(true);
        console.timeEnd('show');
    }
});

ReactDOM.render(
    <List />,
    document.getElementById('container')
);
