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
                offsetTop: 0,
                index: 0
            });
        }, 1000);
    }

    constructor(props) {
        super(props);

        this.contener = null;   //główny kontener, ten który ma scrolla
        this.contenerBottom = null;     //dolny kontener - referencyjny dla dzieci
        this.child = {};

        this.state = {
            offsetTop: null,         //gdy null, to faza inicjowania
            index: null,
        };
    }
/*
gdy scroll spowodował że wyjechaliśmy za okno
    to wyznacz na nowo offsetTop

za każdym razem ustalaj na nowo wysokość głównego kontenera oraz tego czanka na dole
*/

/*
dwa rodzaje zdarzeń mają zachodzić
szybkie - bez debancingu, powodujące tylko odświeżenie duszków
wolne - majace narysować zawartość
*/
    render() {
        const offsetTop = this.state.offsetTop;
        const [start, stop, indexList1, indexList2] = this._getIndex(this.state.index);

        this.child = this._rewriteChild(start, stop);

        const heightBottom = (this.state.index === null) ? 0 :this._findHeightBottom(this.state.index, this.child);

        //debounce(this._onScroll, 0)
        return (
            <div className="Scroll" ref={this._getRef} onScroll={this._onScroll}>
                <div className="Scroll__top" style={{height: offsetTop+'px'}}>
                    <div className="Scroll__top-inner">
                        {indexList1.map(this._getItem)}
                    </div>
                </div>
                <div className="Scroll__bottom" ref={this._getRefBottom} style={{height: heightBottom + 'px'}}>
                    <div className="Scroll__bottom-inner">
                        {indexList2.map(this._getItem)}
                    </div>
                </div>
            </div>
        );
    }

    _rewriteChild(start, stop) {
        const newChild = {};
        
        for (let i=start; i<stop; i++) {
            newChild[i] = this.child[i] ? this.child[i] : null;
        }
        
        return newChild;
    }

    @autobind
    _onScroll() {

        const scrollTop = this.contener.scrollTop;
        const offsetTop = 0;            //to powinno być nowe wyliczone
        const index = 0;                //to powinno być nowe wyliczone

        const [firstChild, lastChild] = this._getFirstAndLast(this.child);
        const [childTop, childBottom] = this._getRange(firstChild, lastChild);
        
        console.info('first and last', firstChild, lastChild, childTop, childBottom, scrollTop);
        //czy pozycja nowego przesunięcia mieści się w zakresie istniejących dzieci
            //tak
                //dokonaj tylko korekty
            //nie
                //dokonaj zupełnie nowego wyliczenia index-a a na jego podstawie offsetTop
        
        //jest w zerowum - tak - nic nie robimy
        //jest w ostatnim - tak -
            //nie
                //przekracza - tak
                //przekracza nie
        
        console.info('child - powinien być kompletny ten obiekt', this.child);

        this.setState({
            offsetTop : offsetTop,
            index: index
        });
    }


    /*
    const debugBox = (
        <div className="Scroll__debug">
            <div>chank z itemami ({this.state.offsetTop === null ? 'loading' : 'is load'}) -> {this.state.index}</div>
            <div>{this.firstChild ? this._getHeight(this.firstChild) : '--'}</div>
        </div>
    );
    */

/*
    _findIndex() {

        if (this.contener === null) {
            return 0;
        }

        const all = this.contener.scrollHeight - this._getHeight(this.contener);

        const maxLength = this.props.listLength - 1;         //jeśli jest 10 elementów, to potrzebne są indexy od 0.00 do 9.00
        const wsk = (this.state.scrollTop * maxLength) / all;

        const index = Math.floor(wsk);

        return index;
    }
*/

    @autobind
    _getRange(firstChild, lastChild) {
        const rect0 = this.contenerBottom.getBoundingClientRect();
        const rect1 = firstChild.getBoundingClientRect();
        const rect2 = lastChild.getBoundingClientRect();
        return [rect1.top - rect0.top, rect2.bottom - rect0.top];
    }

    @autobind
    _getFirstAndLast(child) {
        const keys = Object.keys(child);
        
        const firstKey = keys.shift();
        const lastKey = keys.pop();
        
        const firstItem = child[firstKey];
        const lastItem = child[lastKey];

        return [firstItem, lastItem];
    }

    @autobind
    _findHeightBottom(index, child) {

        let indexFor = index;
        const listLength = this.props.listLength;
        let outHeight = 0;
        
        for (;;) {
            if (indexFor <= listLength - 1) {
                const item = child[indexFor];
                if (item) {
                    outHeight += this._getHeight(item);
                    indexFor++;
                } else {
                    const othersItems = listLength - indexFor;
                    return outHeight + this.props.estimatedHeight * othersItems;
                }
            } else {
                return outHeight;
            }
        }
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

        return [start, stop, indexList1, indexList2];
    }

    @autobind
    _getItem(index) {
        const ref = this._getRefChild.bind(this, index);

        return (
            <div key={index} ref={ref} style={{width: '100%'}}>
                {this.props.getItem(index)}
            </div>
        );
    }

    _getHeight(domElement) {
        const rect = domElement.getBoundingClientRect();
        return rect.bottom - rect.top;
    }

    @autobind
    _getRef(contener) {
        this.contener = contener;
    }

    @autobind
    _getRefBottom(contener) {
        this.contenerBottom = contener;
    }

    @autobind
    _getRefChild(index, item) {
        this.child[index] = item;
    }
}

export default Scroll;
