import autobind from 'autobind-decorator';
import React, { PropTypes, Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import Scroll from './Scroll';

/*
class ReactList extends Component {
    static propTypes = {
        estimatedItemHeight: PropTypes.number.isRequired,
        collection: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired
    };
    constructor(props: Object) {
        super(props);
        this.state = this._getInitialState();
    }
    render(): any {
        return (
            <div className="ReactList">
            asdasdas react list
            </div>
        );
    }
}
*/

class App extends Component {
    renderItem() {

    }
    render(): any {
        return (
            <div style={{width: '300px', height: '400px', backgroundColor: 'yellow'}}>
                <Scroll
                    listLength={100}
                    estimatedHeight={200}
                    getItem={this._getItem}
                />
            </div>
        );
    }

    _getItem(index) {
        //const height = ((index % 5 + 2.5 * (index % 2)) * 70);

        const height = 200 + index % 2 * 100;
        const color = index % 2 ? '#e0e0e0' : '#888'; //yellow';

        const style = {
            'display' : 'flex',
            'alignItems' : 'center',
            'justifyContent' : 'center',
            'width' : '100%',
            'height' : (height > 0 ? height : 100) + 'px',
            backgroundColor : color,
            color: 'black',
            'textAlign' : 'center'
        };

        return (
            <div style={style}>
                <span>element : {index}</span>
            </div>
        );
    }
/*
<ReactList
    estimatedItemHeight={200}
    collection={[]}
    renderItem={renderItem}
/>
*/
}


render(<App/>, document.getElementById('app'))
