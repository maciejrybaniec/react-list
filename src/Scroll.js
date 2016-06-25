import autobind from 'autobind-decorator';
//import cx from 'classnames';
import debounce from 'lodash/debounce';
import React, { PropTypes, Component } from 'react';

//import './Scroll.scss';

class Scroll extends Component {

    static propTypes = {
        listLength: PropTypes.number.isRequired,
        estimatedHeight : PropTypes.number.isRequired,
        getItem : PropTypes.func.isRequired
    };

    componentDidMount() {
        //super.componentDidMount();

        setTimeout(()=>{
            this.setState({
                isInit: true
            });
        }, 1000);
    }

    constructor(props) {
        super(props);

        this.contener = null;   //główny kontener, ten który ma scrolla
        this.firstChild = null;

        this.state = {
            isInit: false,
            estimatedHeight: 200,       //szacowana wysokość
            scrollTop: 0
        };
    }
/*
dwa rodzaje zdarzeń mają zachodzić
szybkie - bez debancingu, powodujące tylko odświeżenie duszków
wolne - majace narysować zawartość
 */
    render() {
        const styleInner = {
            height: (this.props.listLength * this.props.estimatedHeight) + 'px'
        };

        const title = this.state.isInit ? 'is load' : 'loading';

        const [index, percent] = this._calculate();
        //weźaktualnego scrolla, wyznacz pozycję tego elementu
        //TODO - na początek powinien pokazywać numer elementu który ma być widoczny, oraz w jakim procencie na ekranie

        const offsetTop = /*index * this.props.estimatedHeight*/ - this._subOffser(percent);    // + (this.state.percent / 100);

        const [isContent, indexList1, indexList2] = this._getIndex(index);

        const content1 = (isContent === true) ? this._getChankTop(index, offsetTop, indexList1) : null;
        const content2 = (isContent === true) ? this._getChankBottom(index, offsetTop, indexList2) : null;

        console.info('isContent', isContent, index, offsetTop, this.firstChild && this._getHeight(this.firstChild));

        return (
            <div className="Scroll">
                <div className="Scroll__scroll" ref={this._getRef} onScroll={debounce(this._onScroll, 0)}>
                    <div className="Scroll__inner" style={styleInner}>
                        {content1}
                        {content2}
                    </div>
                </div>
                <div className="Scroll__debug">
                    <div>chank z itemami ({title}) -> {index} -> {percent}</div>
                    <div>{index * this.props.estimatedHeight} - {this._subOffser(percent)} = {offsetTop}</div>
                    <div>{this.firstChild ? this._getHeight(this.firstChild) : '--'}</div>
                </div>

            </div>
        );
    }

    _calculate() {

        if (this.contener === null) {
            return [0,0];
        }

        const all = this.contener.scrollHeight - this._getHeight(this.contener);

        const maxLength = this.props.listLength - 1;                            //jeśli jest 10 elementów, to potrzebne są indexy od 0.00 do 9.00
        const wsk = (this.state.scrollTop * maxLength) / all;

        const index = Math.floor(wsk);
        const percent = wsk - index;

        return [index, percent];
    }

    _subOffser(percent) {
        if (this.firstChild !== null) {
            const childHeight = this._getHeight(this.firstChild);
            return Math.floor(childHeight * percent);
        }

        return 0;
    }

    @autobind
    _getRef(contener) {
        this.contener = contener;
    }

    @autobind
    _getFirstChild(item) {
        this.firstChild = item;
    }

    @autobind
    _onScroll() {
        this.setState({
            scrollTop: this.contener.scrollTop
        });
    }

    _getIndex(index) {
        const start = Math.max(index - 10, 0);
        const stop = Math.min(index + 10, this.props.listLength-1);

        const indexList1 = [];
        const indexList2 = [];

        for (let i=start; i<stop; i++) {
            if (i < index) {
                indexList1.push(i);
            } else {
                indexList2.push(i);
            }
        }

        return [this.contener !== null, indexList1, indexList2];
    }

    @autobind
    _getChankTop(index, offsetTop, indexList) {
        const bottom = this.contener.scrollHeight - offsetTop;

        const style = {
            position: 'absolute',
            left: '0px',
            bottom: bottom + 'px',
            width: '80%'
        };

        return (
            <div className="Scroll__chank-top" style={style}>
                {this._getItemList(index, indexList)}
            </div>
        );
    }

    @autobind
    _getChankBottom(index, offsetTop, indexList) {
        const style = {
            position: 'absolute',
            left: '0px',
            top: offsetTop + 'px',
            'borderTop' : '4px solid red',
            width: '80%'
        };

        return (
            <div className="Scroll__chank-bottom" style={style}>
                {this._getItemList(index, indexList)}
            </div>
        );
    }

    @autobind
    _getItemList(index, indexList) {
        return indexList.map((indexLocal) => {
            return this._getItem(indexLocal, index === indexLocal);
        });
    }

    @autobind
    _getItem(index, addRef) {
        const attr = {};

        if (addRef === true) {
            attr.ref = this._getFirstChild;
        }

        return (
            <div key={index} {...attr} style={{width: '100%'}}>
                {this.props.getItem(index)}
            </div>
        );
    }

    _getHeight(domElement) {
        const rect = domElement.getBoundingClientRect();
        return rect.bottom - rect.top;
    }
}

export default Scroll;
