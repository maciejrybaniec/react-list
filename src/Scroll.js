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
            scrollTop: 0,
            index: 0,
            offsetTop: null         //gdy null, to trzeba wyznaczyć na podstawie scrolla
        };
    }
/*
gdy przesunięcie spowodowało że elementy są nadal widoczne
    to "przesuń" elementy między "czankami", pobierając wysokość elementów przesuwanych

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
        /*
        const styleInner = {
            height: (this.props.listLength * this.props.estimatedHeight) + 'px'
        };
        */

        const title = this.state.isInit ? 'is load' : 'loading';

        const index = this._findIndex();

        const offsetTop = index * this.props.estimatedHeight;

        const [indexList1, indexList2] = this._getIndex(index);

        console.info('render', index, offsetTop, this.firstChild && this._getHeight(this.firstChild));

        const debugBox = (
            <div className="Scroll__debug">
                <div>chank z itemami ({title}) -> {index}</div>
                <div>{this.firstChild ? this._getHeight(this.firstChild) : '--'}</div>
            </div>
        );
        
        return (
            <div className="Scroll" ref={this._getRef} onScroll={debounce(this._onScroll, 0)}>
                <div className="Scroll__top" style={{height: offsetTop+'px'}}>
                    <div className="Scroll__top-inner">
                        {this._getItemList(index, indexList1)}
                    </div>
                </div>
                <div className="Scroll__bottom">
                    <div className="Scroll__bottom-inner">
                        {this._getItemList(index, indexList2)}
                    </div>
                </div>
                {debugBox}
            </div>
        );
    }

    _findIndex() {

        if (this.contener === null) {
            return 0;
        }

        const all = this.contener.scrollHeight - this._getHeight(this.contener);

        const maxLength = this.props.listLength - 1;                            //jeśli jest 10 elementów, to potrzebne są indexy od 0.00 do 9.00
        const wsk = (this.state.scrollTop * maxLength) / all;

        const index = Math.floor(wsk);

        return index;
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

        return [indexList1, indexList2];
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
