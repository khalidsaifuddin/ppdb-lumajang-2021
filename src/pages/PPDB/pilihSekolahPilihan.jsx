import React, {Component} from 'react';
import {
    Page, Navbar, Popup, NavTitle, NavTitleLarge, Block, Link, Icon, Segmented, Button, CardContent, Row, Col, Card, CardHeader, List, ListInput, ListItem, Searchbar, Sheet, Toolbar, PageContent, Radio, NavLeft, NavRight, Fab, Subnavbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';
import { getCalonPesertaDidik } from '../../store/actions';

class pilihSekolahPilihan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            peserta_didik_id: this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null,
            jalur_id: this.$f7route.params['jalur_id'],
            start: 0,
            limit: 20
        },
        urut_pilihan: this.$f7route.params['urut_pilihan'] ? this.$f7route.params['urut_pilihan'] : null,
        bujur: this.$f7route.params['bujur'] !== 'undefined' ? parseFloat(this.$f7route.params['bujur']) : 113.141552,
        lintang: this.$f7route.params['lintang'] !== 'undefined' ? parseFloat(this.$f7route.params['lintang']) : -8.109038,
        zoom: 17,
        hasLocation: false,
        popup: (''),
        sekolah: {
            total: 0,
            rows: []
        },
        popupFilter: false,
        routeParamsFilter: {}
        // popup: (<div>Lokasi Rumah PD</div>)
    }

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    bulan = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ]

    componentDidMount = () => {
        console.log(this.$f7route.url);
        localStorage.setItem('current_url', this.$f7route.url);

        // console.log(this.$f7route.params['jalur_id'])

        this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    ...result.payload.rows[0]
                },
                routeParamsFilter: {
                    lintang: result.payload.rows[0].lintang, 
                    bujur: result.payload.rows[0].bujur,
                    dengan_tk: 'N',
                    untuk_pilihan: 'Y',
                    start: 0,
                    limit: 20,
                    peserta_didik_id: this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null,
                    status_sekolah: (parseInt(this.$f7route.params['urut_pilihan']) === 4 ? 2 : 1)
                }
            },()=>{
                
                this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
                    this.setState({
                        sekolah: result.payload
                    },()=>[
                        console.log(this.state)
                    ])
                })

            })
        })


    }
    
    simpan = () => {

        this.setState({
            routeParams: {
                ...this.state.routeParams
            }
        },()=>{
            
        });
    }    

    setSelectValue = (key) => (b) => {
        // console.log(b);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: b.target.value
            }
        },()=>{
            
        });
    }

    setFieldValue = (key) => (e) => {
        this.setState({
            routeParamsFilter: {
                ...this.state.routeParamsFilter,
                [key]: e.target.value
            }
        },()=>{
            console.log(this.state.routeParamsFilter);
        });
    }


    ketikCari = (e) => {
        this.setState({
            routeParamsFilter: {
                ...this.state.routeParamsFilter,
                keyword: e.currentTarget.value,
                searchText: e.currentTarget.value,
            }
        }, ()=> {
            
        });
    }

    cari = () => {
        this.$f7.dialog.preloader()
        this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
            this.setState({
                sekolah: result.payload,
                popupFilter: false
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    tampilkanSekolahFilter = () => {
        this.$f7.dialog.preloader()
        this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
            this.setState({
                sekolah: result.payload,
                popupFilter: false
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    resetFilter = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParamsFilter: {
                ...this.state.routeParamsFilter,
                bentuk_pendidikan_id: null,
                status_sekolah: null,
                keyword: null
            }
        },()=>{

            this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
                this.setState({
                    sekolah: result.payload,
                    popupFilter: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    pilihSekolah = (sekolah_id) => (e) => {
        this.$f7.dialog.preloader()
        this.props.simpanSekolahPilihan({
            ...this.state.routeParams,
            sekolah_id: sekolah_id,
            peserta_didik_id: this.$f7route.params['peserta_didik_id'],
            jalur_id: this.$f7route.params['jalur_id'],
            pengguna_id: this.$f7route.params['pengguna_id']         
        }).then((result)=>{
            this.$f7.dialog.close()
            this.$f7router.navigate('/formSekolahPilihan/'+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
        })
    }

    klikNext = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParamsFilter: {
                ...this.state.routeParamsFilter,
                start: (parseInt(this.state.routeParamsFilter.start) + parseInt(this.state.routeParamsFilter.limit))
            }
        },()=>{
            this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
                this.setState({
                    sekolah: result.payload,
                    popupFilter: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        });
    }
    
    klikPrev = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParamsFilter: {
                ...this.state.routeParamsFilter,
                start: (parseInt(this.state.routeParamsFilter.start) - parseInt(this.state.routeParamsFilter.limit))
            }
        },()=>{
            this.props.getSekolahPPDB(this.state.routeParamsFilter).then((result)=>{
                this.setState({
                    sekolah: result.payload,
                    popupFilter: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        });
    }
    
    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="pilihSekolahPilihan">
                <Navbar sliding={false} backLink="Kembali">
                {/* <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}> */}
                    {/* <NavLeft>
                        <Button fill raised onClick={this.konfirmasiKoordinat} iconIos="f7:floppy_disk" iconAurora="f7:floppy_disk" iconMd="material:floppy_disk">
                            &nbsp;Simpan
                        </Button>
                    </NavLeft> */}
                    <NavTitle sliding>Pilih Sekolah ke-{parseInt(this.$f7route.params['urut_pilihan'])} ({(parseInt(this.$f7route.params['urut_pilihan']) === 4 ? 'Swasta' : 'Negeri')})</NavTitle>
                    {/* <NavTitleLarge>
                        Peta
                    </NavTitleLarge> */}
                    <NavRight>
                        <Button onClick={()=>this.setState({popupFilter:!this.state.popupFilter})}>
                            <i className="icons f7-icons">arrow_right_arrow_left_square</i>&nbsp;
                            Filter
                        </Button>
                    </NavRight>
                    <Subnavbar>
                        <Searchbar
                        className="searchbar-demo"
                        placeholder="Cari sekolah..."
                        searchContainer=".search-list"
                        searchIn=".item-title"
                        onSubmit={this.cari}
                        customSearch={true}
                        onChange={this.ketikCari}
                        value={this.state.routeParams.keyword}
                        />
                    </Subnavbar>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="90" desktopWidth="80">
                        <div className="data-table" style={{overflowY:'hidden'}}>
                            <div className="data-table-footer" style={{display:'block'}}>
                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParamsFilter.start < 1 ? "disabled" : "" )}>
                                    <i class="icon icon-prev color-gray"></i>
                                    </a>
                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParamsFilter.start)+20) >= parseInt(this.state.sekolah.total) ? "disabled" : "" )}>
                                        <i className="icon icon-next color-gray"></i>
                                    </a>
                                    <span className="data-table-pagination-label">{(this.state.routeParamsFilter.start+1)}-{(this.state.routeParamsFilter.start)+parseInt(this.state.routeParamsFilter.limit) <= parseInt(this.state.sekolah.total) ? (this.state.routeParamsFilter.start)+parseInt(this.state.routeParamsFilter.limit) : parseInt(this.state.sekolah.total)} dari {this.formatAngka(this.state.sekolah.total)} Sekolah {(parseInt(this.$f7route.params['urut_pilihan']) === 4 ? 'Swasta' : 'Negeri')}</span>
                                </div>
                            </div>
                        </div>
                        <Card style={{marginTop:'0px'}}>
                            <CardContent>
                                {this.state.sekolah.rows.map((option)=>{
                                    return (
                                        <Card key={option.sekolah_id} style={{marginRight:'0px', marginLeft:'0px'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="25" tabletWidth="15" desktopWidth="10">
                                                        <div className="fotoSekolah" style={{backgroundImage: "url(http://foto.data.kemdikbud.go.id/getImage/" + option.npsn + "/1.jpg)", backgroundSize:'cover', backgroundPosition:'center'}}>
                                                            &nbsp;
                                                        </div>
                                                    </Col>
                                                    <Col width="75" tabletWidth="55" desktopWidth="60">
                                                        <b>{option.nama}</b> ({option.npsn})
                                                        <br/>
                                                        <span style={{fontSize:'10px'}}>
                                                            {option.alamat}{option.kecamatan ? <>, {option.kecamatan}</> : <></>}{option.kabupaten ? <>, {option.kabupaten}</> : <></>}{option.provinsi ? <>, {option.provinsi}</> : <></>}
                                                        </span>
                                                        <br/>
                                                        <span style={{fontSize:'10px'}}>
                                                                {option.bentuk} | {parseInt(option.status_sekolah) === 1 ? 'Negeri' : 'Swasta'}
                                                        </span>
                                                    </Col>
                                                    <Col width="0" tabletWidth="15" desktopWidth="10">
                                                        <div style={{fontSize:'8px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'20px', marginTop:'8px', padding:'4px', paddingRight:'4px', margin:'4px'}}>
                                                            Jarak Rumah-Sekolah
                                                            <br/>
                                                            <span style={{fontSize:'16px', fontWeight:'bold'}}>{parseFloat(option.jarak) <= 50 ? parseFloat(option.jarak).toFixed(2) : '> 50'}</span> km
                                                        </div>
                                                    </Col>
                                                    <Col width="100" tabletWidth="20" desktopWidth="20">
                                                        {!option.sekolah_pilihan_id &&
                                                        <Button className="bawahCiriBiru" fill raised style={{marginTop:'8px'}} onClick={this.pilihSekolah(option.sekolah_id)}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>checkmark_alt_circle_fill</i>&nbsp;
                                                            Pilih Sekolah
                                                        </Button>
                                                        }
                                                        {option.sekolah_pilihan_id &&
                                                        <Button disabled raised style={{marginTop:'8px'}} onClick={this.pilihSekolah(option.sekolah_id)}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>checkmark_alt_circle_fill</i>&nbsp;
                                                            Telah Dipilih
                                                        </Button>
                                                        }
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                </Row>
                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Daftar Sekolah">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <ListInput
                                    label="Bentuk"
                                    type="select"
                                    defaultValue={"0"}
                                    placeholder="Pilih Bentuk..."
                                    onChange={this.setFieldValue('bentuk_pendidikan_id')}
                                >
                                    <option value={"99"}>Semua</option>
                                    <option value={"1"}>TK</option>
                                    <option value={"5"}>SD</option>
                                    <option value={"6"}>SMP</option>
                                </ListInput>
                                {/* <ListInput
                                    label="Status"
                                    type="select"
                                    defaultValue={"0"}
                                    placeholder="Pilih Status..."
                                    onChange={this.setFieldValue('status_sekolah')}
                                >
                                    <option value={"99"}>Semua</option>
                                    <option value={"1"}>Negeri</option>
                                    <option value={"2"}>Swasta</option>
                                </ListInput> */}
                                <ListInput
                                    label="Urutkan"
                                    type="select"
                                    defaultValue={"0"}
                                    placeholder="Pilih Urutkan..."
                                    onChange={this.setFieldValue('urutkan')}
                                >
                                    <option value={"az"}>A-Z</option>
                                    <option value={"za"}>Z-A</option>
                                </ListInput>
                            </List>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button raised onClick={this.resetFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                        Reset Filter
                                    </Button>
                                </Col>
                                <Col width="50">
                                    <Button raised fill onClick={this.tampilkanSekolahFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Sekolah
                                    </Button>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getSekolahPPDB: Actions.getSekolahPPDB,
      getCalonPesertaDidik: Actions.getCalonPesertaDidik,
      simpanSekolahPilihan: Actions.simpanSekolahPilihan,
    }, dispatch);
}

function mapStateToProps({ App, Ref, PPDB }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(pilihSekolahPilihan));
  