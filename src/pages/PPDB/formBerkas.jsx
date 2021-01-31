import React, {Component} from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  Card,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Icon,
  SkeletonText,
  CardHeader,
  CardContent,
  CardFooter,
  Subnavbar,
  ListItemContent,
  Badge,
  ListInput,
  Popover,
  Searchbar,
  Segmented,
  Popup,
  Radio,
  Tabs,
  Tab
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';

import io from 'socket.io-client';

import moment from 'moment';
import HeaderPPDB from './HeaderPPDB';
import HeaderSekolahPPDB from './HeaderSekolahPPDB';

import Dropzone from 'react-dropzone';

class formBerkas extends Component {

    state = {
        error: null,
        loading: true,
        sekolah: {
            gambar_logo: '/assets/berkas/1.jpg'
        },
        routeParams: {
            pengguna_id: this.$f7route.params['pengguna_id'],
            sekolah_id: this.$f7route.params['sekolah_id'],
            peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
        },
        jalur_id: "0100",
        jalur_berkas: {
            rows: [],
            total: 0
        },
        jalur: {},
        berkas_calon:{}
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        
        this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0]
            },()=>{
                this.props.getJalurPPDB({jalur_id:this.$f7route.params['jalur_id']}).then((result)=>{

                    this.setState({
                        jalur: result.payload.rows[0]
                    },()=>{

                        this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
                            this.setState({
                                routeParams: {
                                    ...this.state.routeParams,
                                    ...result.payload.rows[0]
                                }
                            },()=>{
                                this.props.getJalurBerkas({jalur_id:this.$f7route.params['jalur_id']}).then((result)=>{
                                    this.setState({
                                        jalur_berkas: result.payload
                                    },()=>{
                                        let arrJalurBerkas = {}

                                        for (let indexJalurBerkas = 0; indexJalurBerkas < this.state.jalur_berkas.rows.length; indexJalurBerkas++) {
                                            const element = this.state.jalur_berkas.rows[indexJalurBerkas];
                                            
                                            // console.log(element)
                                            arrJalurBerkas[element.jenis_berkas_id] = element

                                            // console.log(arrJalurBerkas[element.jenis_berkas_id])
                                            
                                        }

                                        // console.log(arrJalurBerkas)
                                        this.setState({
                                            berkas_calon: {...arrJalurBerkas}
                                        },()=>{
                                            // console.log(this.state)
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })

    }

    acceptedFile = (jenis_berkas_id) => (file) => {
        if(file[0].size >= 10000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 10MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
            
            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    berkas_calon: {
                        ...this.state.berkas_calon,
                        [jenis_berkas_id]: {
                            ...this.state.berkas_calon[jenis_berkas_id],
                            file_gambar: this.props.uuid_kuis
                        }
                    }
                },()=>{

                    console.log(this.state.berkas_calon)
        
                    // return new Promise(
                    //     (resolve, reject) => {
                    //         const xhr = new XMLHttpRequest();
                    //         xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                    //         xhr.onload = this.uploadBerhasil;
                    //         xhr.onerror = this.uploadGagal;
                    //         const data = new FormData();
                    //         data.append('image', file[0]);
                    //         data.append('pengguna_id', this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id);
                    //         // data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                    //         data.append('guid', this.state.guid_gambar);
                    //         data.append('jenis', 'gambar_kuis');
                    //         xhr.send(data);
                    //     }
                    // );
                });

            });

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
            return true;
        }

    }

    render()
    {
        return (
          <Page name="formBerkas" hideBarsOnScroll>
            
            <HeaderPPDB />

            <div className="cardAtas" style={{marginBottom:'50px'}}>
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                    <Row noGap>
                        <Col width="100" tabletWidth="100">
                            <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                        </Col>
                        <Col width="0" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent padding={false}>
                                <Segmented className="steps color-theme-deeporange" raised style={{borderRadius:'20px'}}>
                                <Button disabled={false} onClick={()=>this.$f7router.navigate("/formBiodata/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} style={{borderRadius:'20px 0px 0px 20px'}}>Biodata</Button>
                                <Button disabled={false} onClick={()=>this.$f7router.navigate("/formSekolahPilihan/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jalur dan Pilihan Sekolah</Button>
                                <Button tabLinkActive>Kelengkapan Berkas</Button>
                                <Button disabled={true}>Konfirmasi</Button>
                                </Segmented>
                            </CardContent>
                        </Card>
                        </Col>
                        <Col width="100" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent style={{padding:'8px'}}>
                                
                                <BlockTitle style={{marginTop:"8px", marginBottom:'8px'}}>Kelengkapan Berkas untuk Jalur {this.state.jalur.nama}</BlockTitle>
                                <Row>
                                    <Col width="100" tabletWidth="30">
                                        <Card style={{marginRight:'4px', marginLeft:'0px'}}>
                                            <CardContent>
                                                {this.state.jalur_berkas.rows.map((option)=>{
                                                    if((parseInt(this.state.jalur_berkas.rows.indexOf(option))+1) === 1){
                                                        return (
                                                            <>
                                                                <Link key={option.jenis_berkas_id} style={{marginBottom:'8px'}} tabLinkActive tabLink={"#tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)}>{option.nama}</Link><br/>
                                                            </>
                                                        )
                                                    }else{
                                                        return (
                                                            <>
                                                                <Link key={option.jenis_berkas_id} style={{marginBottom:'8px'}} tabLink={"#tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)}>{option.nama}</Link><br/>
                                                            </>
                                                        )
                                                    }
                                                })}
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100" tabletWidth="70">
                                        <Card style={{marginRight:'0px', marginLeft:'4px'}}>
                                            <CardContent>
                                                <Tabs>
                                                    {/* <Tab id={"tab-0"} className="page-content" tabLinkActive>
                                                        Pilih jenis berkas untuk menampilkan
                                                    </Tab> */}
                                                    {this.state.jalur_berkas.rows.map((option)=>{
                                                        
                                                        // console.log(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)
                                                        // console.log(option)
                                                        console.log(this.state.berkas_calon[option.jenis_berkas_id])
                                                        
                                                        if((parseInt(this.state.jalur_berkas.rows.indexOf(option))+1) === 1){
                                                            //yang pertama
                                                            return (
                                                                <Tab key={option.jenis_berkas_id} id={"tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)} className="page-content" tabActive>
                                                                    {option.nama}
                                                                    <br/>
                                                                    {/* <Dropzone className="droping" onDrop={this.acceptedFile(option.jenis_berkas_id)}>
                                                                    {({getRootProps, getInputProps}) => (
                                                                        <section>
                                                                            <div {...getRootProps()} style={{borderRadius:'20px', height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                                                <input {...getInputProps()} />
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar === '' &&
                                                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' &&
                                                                                <>
                                                                                <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.berkas_calon[option.jenis_berkas_id].file_gambar} />
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].gambar === '' &&
                                                                                <>
                                                                                <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].gambar !== '' && this.state.berkas_calon[option.jenis_berkas_id].file_gambar === '' &&
                                                                                <>
                                                                                <p style={{fontSize:'20px'}}>{this.state.berkas_calon[option.jenis_berkas_id].gambar}</p>
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                            </div>
                                                                        </section>
                                                                    )}
                                                                    </Dropzone> */}
                                                                </Tab>
                                                            )

                                                        }else{
                                                            //yang berikutnya
                                                            return (
                                                                <Tab id={"tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)} className="page-content">
                                                                    {option.nama}
                                                                    <br/>
                                                                </Tab>
                                                            )

                                                        }

                                                    })}
                                                </Tabs>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        </Col>
                    </Row>
                  </Col>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
              </Row>
            </div>
          </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateWindowDimension: Actions.updateWindowDimension,
        setLoading: Actions.setLoading,
        setTabActive: Actions.setTabActive,
        getSekolah: Actions.getSekolah,
        getCalonPesertaDidik: Actions.getCalonPesertaDidik,
        getWilayah: Actions.getWilayah,
        getJalurPPDB: Actions.getJalurPPDB,
        getJalurBerkas: Actions.getJalurBerkas,
        generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, PPDB, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        wilayah: App.wilayah,
        sekolah: Sekolah.sekolah,
        cek_nik: PPDB.cek_nik,
        cek_nisn: PPDB.cek_nisn,
        calon_peserta_didik: PPDB.calon_peserta_didik, 
        jalur: PPDB.jalur,
        uuid_kuis: Kuis.uuid_kuis
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(formBerkas);