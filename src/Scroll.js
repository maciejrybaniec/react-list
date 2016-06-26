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

        const currentItem = this._findCurrent(scrollTop, this.child);
        
        if (currentItem === null) {
            //wyznaczaj przybliżony rozmiar na podstawie scrolla
        } else {
            //przesuń płynnie
        }

        console.info('znaleziony current', currentItem);

        this.setState({
            offsetTop : offsetTop,
            index: index
        });
    }

    @autobind
    _findCurrent(scrollTop, child) {
        
        const contenerTopOffset = this.contenerBottom.getBoundingClientRect().top;
        const newScrollTop = contenerTopOffset + scrollTop;
        const indexList = Object.keys(child);
        
        if (this._isScrollInList(indexList, newScrollTop)) {
            return this._findCurrentFromList(indexList, newScrollTop);
        } else {
            return null;
        }
    }

    @autobind
    _findCurrentFromList(indexList, scrollTop) {
        
        if (indexList.length === 1) {
            return indexList[0];
        }
        
        const [left, right] = this._splitToHalf(indexList);

        if (this._isScrollInList(left, scrollTop)) {
            return this._findCurrentFromList(left, scrollTop);
        } else {
            return this._findCurrentFromList(right, scrollTop);
        }
    }

    @autobind
    _isScrollInList(indexList, scrollTop) {
        
        const firstItem = this.child[indexList[0]];
        const lastItem = this.child[indexList[indexList.length - 1]];
        
        const rect1 = firstItem.getBoundingClientRect();
        const rect2 = lastItem.getBoundingClientRect();
        
        return rect1.top <= scrollTop && scrollTop <= rect2.bottom;
    }

    @autobind
    _splitToHalf(list) {
        const center = Math.floor(list.length / 2);
        
        const left = [];
        const right = [];
        
        while (list.length > 0) {
            if (list.length % 2 === 0) {
                left.push(list.shift());
            } else {
                right.unshift(list.pop());
            }
        }
        
        return [left, right];
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
