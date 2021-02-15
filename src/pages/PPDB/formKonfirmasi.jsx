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

class formKonfirmasi extends Component {

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
        berkas_calon:{},
        imageHash: Date.now(),
        pengguna: {},
        sekolah_pilihan: {
            rows: [],
            total: 0
        },
        sekolah_pilihan_record: {}
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
                                this.props.getJalurBerkas({jalur_id:this.$f7route.params['jalur_id'], peserta_didik_id:this.$f7route.params['peserta_didik_id'] }).then((result)=>{
                                    this.setState({
                                        jalur_berkas: result.payload
                                    },()=>{
                                        let arrJalurBerkas = {}

                                        for (let indexJalurBerkas = 0; indexJalurBerkas < this.state.jalur_berkas.rows.length; indexJalurBerkas++) {
                                            const element = this.state.jalur_berkas.rows[indexJalurBerkas];

                                            element.file_gambar = element.nama_file ? element.nama_file : ''
                                            element.gambar = element.nama_file ? element.nama_file.split("/")[3] : ''
                                            
                                            // console.log(element)
                                            arrJalurBerkas[element.jenis_berkas_id] = element

                                            // console.log(arrJalurBerkas[element.jenis_berkas_id])
                                            
                                        }

                                        // console.log(arrJalurBerkas)
                                        this.setState({
                                            berkas_calon: {...arrJalurBerkas}
                                        },()=>{
                                            // console.log(this.state)
                                            this.props.getPengguna({pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
                                                if(result.payload.total > 0){
                                                    this.setState({
                                                        pengguna: result.payload.rows[0]
                                                    },()=>{
                                                        this.props.getSekolahPilihan(this.state.routeParams).then((result)=>{
                                                            this.setState({
                                                                sekolah_pilihan: result.payload,
                                                                sekolah_pilihan_record: result.payload.rows[0]
                                                            })
                                                        })
                                                    })
                                                }
                                            })
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
        this.$f7.dialog.preloader()

        if(file[0].size >= 10000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 10MB!', 'Peringatan');
            return true;
        }
        
        // if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
        try {
        
            if(
                file[0].name.split(".")[1] === 'jpg' ||
                file[0].name.split(".")[1] === 'png' ||
                file[0].name.split(".")[1] === 'jpeg' ||
                file[0].name.split(".")[1] === 'webp' ||
                file[0].name.split(".")[1] === 'gif'
            ){

                let ekstensi = file[0].name.split(".")[1];
                console.log(ekstensi)

                this.props.generateUUID(this.state.routeParams).then((result)=>{

                    this.setState({
                        berkas_calon: {
                            ...this.state.berkas_calon,
                            [jenis_berkas_id]: {
                                ...this.state.berkas_calon[jenis_berkas_id],
                                gambar: this.props.uuid_kuis+"."+ekstensi,
                                file_gambar: "/assets/berkas/"+this.props.uuid_kuis+"."+ekstensi
                            }
                        }
                    },()=>{

                        console.log(this.state.berkas_calon)
            
                        return new Promise(
                            (resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', "https://be.diskuis.id" + '/api/Ruang/upload');
                                // xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                                xhr.onload = this.uploadBerhasil(jenis_berkas_id);
                                xhr.onerror = this.uploadGagal;
                                const data = new FormData();
                                data.append('image', file[0]);
                                data.append('pengguna_id', this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id);
                                // data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                                data.append('guid', this.props.uuid_kuis);
                                data.append('gambar', this.props.uuid_kuis+"."+ekstensi);
                                data.append('jenis', 'gambar_kuis');
                                xhr.send(data);
                            }
                        );
                    });

                });

            }else{
                this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
                return true;
            }

        } catch (error) {
            this.$f7.dialog.alert('file tidak dikenali. Mohon gunakan file lain!', 'Peringatan');
            return true;
        }

    }

    uploadBerhasil = (jenis_berkas_id) => (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar: response.filename,
                loading: false,
                imageHash: Date.now()
            });
            this.props.simpanBerkasCalon({
                peserta_didik_id: this.$f7route.params['peserta_didik_id'],
                pengguna_id: this.$f7route.params['pengguna_id'],
                jenis_berkas_id: jenis_berkas_id,
                nama_file: response.filename,
                keterangan: ''
            }).then((result)=>{
                this.$f7.dialog.close()
            })
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.close()
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    simpan = () => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin mengonfirmasi calon peserta didik ini?','Konfirmasi',()=>{

            this.$f7.dialog.preloader()
    
            this.props.simpanKonfirmasi({...this.state.routeParams, peserta_didik_id: this.$f7route.params['peserta_didik_id']}).then((result)=>{
    
                if(result.payload.sukses){
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Calon Peserta Didik baru telah berhasil dikonfirmasi!','Berhasil',()=>{
                        this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
                    })
                }
                // this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
            })

        })

        
        // this.props.simpanSekolahPilihan({peserta_didik_id: this.$f7route.params['peserta_didik_id'], jalur_id: this.state.jalur_id}).then((result)=> {
        // })
    }

    konfirmasiNanti = () => {
        this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
    }

    render()
    {
        let waktu_mulai = '';
        let tgl_waktu_mulai = new Date();
        waktu_mulai = moment(tgl_waktu_mulai).format('D') + ' ' + this.bulan[(moment(tgl_waktu_mulai).format('M')-1)] + ' ' + moment(tgl_waktu_mulai).format('YYYY') + ', pukul ' + moment(tgl_waktu_mulai).format('H') + ':' + moment(tgl_waktu_mulai).format('mm');


        return (
          <Page name="formKonfirmasi" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

            <div className="cardAtas" style={{marginBottom:'50px'}}>
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                    <Row noGap>
                        <Col width="100" tabletWidth="100">
                            <HeaderSekolahPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah={this.state.sekolah} f7={this} />
                        </Col>
                        <Col width="0" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent padding={false}>
                                <Segmented className="steps color-theme-deeporange" raised style={{borderRadius:'20px'}}>
                                <Button disabled={true} onClick={()=>this.$f7router.navigate("/formBiodata/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} style={{borderRadius:'20px 0px 0px 20px'}}>Biodata</Button>
                                <Button disabled={true} onClick={()=>this.$f7router.navigate("/formSekolahPilihan/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jalur dan Pilihan Sekolah</Button>
                                <Button disabled={true}>Kelengkapan Berkas</Button>
                                <Button tabLinkActive>Konfirmasi</Button>
                                </Segmented>
                            </CardContent>
                        </Card>
                        </Col>
                        <Col width="100" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="100">
                                        <Card style={{marginRight:'0px', marginLeft:'4px', borderRadius:'5px', backgroundImage:'url(./static/icons/ricepaper_v3.png)'}}>
                                            <CardContent>
                                                <h3>
                                                    KONFIRMASI PENDAFTARAN PESERTA DIDIK BARU
                                                </h3>
                                                <div variant="caption">
                                                    Tanggal {waktu_mulai}
                                                </div>
                                                <br/>
                                                <div variant="body1">
                                                    Dengan ini Saya, <b>{this.state.routeParams.nama_pengguna}</b> sebagai pendaftar bagi peserta didik atas nama <b>{this.state.routeParams.nama} ({this.state.routeParams.nik})</b> menyatakan bahwa data dan berkas yang diisi pada formulir pendaftaran peserta didik baru telah diperiksa kebenarannya dan telah sesuai dengan fakta yang ada.
                                                </div>
                                                <br/>
                                                <div variant="body1">
                                                    Saya sepenuhnya siap bertanggung jawab apabila di kemudian hari ditemukan ketidaksesuaian antara data yang diisi pada formulir pendaftaran peserta didik baru dengan fakta yang ada, dan Saya siap menerima sanksi moral, sanksi administrasi, dan sanksi hukum sesuai dengan peraturan dan perundang-undangan yang berlaku.
                                                </div>
                                                <br/>
                                                <div variant="body1">
                                                    Penanggungjawab
                                                </div>
                                                <br/>
                                                <div variant="body1" style={{fontWeight:'bold'}}>
                                                    <b>{this.state.pengguna.nama}</b>
                                                    {/* <b>{this.state.routeParams.nama_pengguna}</b> */}
                                                </div>
                                                <hr/>
                                                Jalur Pendaftaran: <b>{this.state.sekolah_pilihan_record.jalur}</b> {this.state.sekolah_pilihan_record.jalur_id === '0300' && <></>}
                                                <br/>
                                                Sekolah Pilihan:
                                                <br/>
                                                <ol>
                                                    {this.state.sekolah_pilihan.rows.map((option)=>{
                                                        return (
                                                            <li>{option.nama}</li>
                                                        )
                                                    })}
                                                </ol>
                                                <hr/>
                                                {/* {this.state.displayOnly === null && */}
                                                <i style={{fontSize:'10px'}}>
                                                    Keterangan:
                                                    <ul>
                                                        <li>
                                                            Peserta didik yang valid adalah peserta didik yang telah dikonfirmasi pendaftarannya oleh pendaftar
                                                        </li>
                                                        <li>
                                                            Waktu pendaftaran bagi peserta didik baru yang bersangkutan diambil dari tanggal konfirmasi pendaftaran
                                                        </li>
                                                        <li>
                                                            Peserta didik baru yang belum dikonfirmasi sampai tanggal yang telah ditentukan, dianggap batal mendaftarkan diri 
                                                        </li>
                                                        <li>
                                                            Peserta didik baru yang telah dikonfirmasi tidak bisa diedit datanya kembali    
                                                        </li>
                                                    </ul>
                                                </i>
                                                {/* } */}
                                                <hr/>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100" style={{textAlign:'right', marginBottom:'16px'}}>
                                        <Button raised className="bawahCiriAbu" style={{display:'inline-flex', marginRight:'4px'}} onClick={this.konfirmasiNanti}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>timer</i>&nbsp;
                                            Konfirmasi Nanti
                                        </Button>
                                        <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpan}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                            Konfirmasi dan Selesai
                                        </Button>
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
        generateUUID: Actions.generateUUID,
        simpanKonfirmasi: Actions.simpanKonfirmasi,
        getPengguna: Actions.getPengguna,
        getSekolahPilihan: Actions.getSekolahPilihan
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
        routeParams: PPDB.routeParams, 
        jalur: PPDB.jalur,
        uuid_kuis: Kuis.uuid_kuis
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(formKonfirmasi);