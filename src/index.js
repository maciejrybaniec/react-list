import autobind from 'autobind-decorator';
import React, { PropTypes, Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class ReactListItem extends Component {
    constructor(props: Object) {
        super(props);
    }
    render(): any {
        return (
            <div className="ReactListItem">
                React Item
            </div>
        );
    }
}

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
        const { visibleItems } = this.state;
        return (
            <div className="ReactList" onScroll={this._onScroll}>
                {visibleItems.map(function(item) {
                    return <ReactListItem {...item} />;
                })}
            </div>
        );
    }
    @autobind
    _calculateDisplayRange() {

    }
    @autobind
    _getInitialState() {
        return {}
    }
    @autobind
    _onScroll(event: Object) {
        console.log('scroll', event.target.scrollTop);
    }
}

render(
    <ReactList
        estimatedItemHeight={200}
        collection={[]}
    />,
    document.getElementById('app')
)
