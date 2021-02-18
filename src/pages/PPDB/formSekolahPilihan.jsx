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
  Radio
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

class formSekolahPilihan extends Component {

    state = {
        error: null,
        loading: true,
        sekolah: {
            gambar_logo: '/assets/berkas/1.jpg'
        },
        routeParams: {
            pengguna_id: this.$f7route.params['pengguna_id'],
            sekolah_id: this.$f7route.params['sekolah_id'],
            jalur_id: '0100',
            peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
        },
        jalur_id: "0100",
        sekolah_pilihan: {
            rows: [],
            total: 0
        },
        jenis_prestasi_id: 1,
        tingkat_prestasi_id: 11,
        nilai_semester_1: 0,
        nilai_semester_2: 0,
        nilai_semester_3: 0,
        nilai_semester_4: 0,
        nilai_semester_5: 0
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

    bulan_singkat = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        this.$f7.dialog.preloader()

        this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0]
            },()=>{
                this.props.getJenisPrestasi(this.state.routeParams)
                this.props.getTingkatPrestasi(this.state.routeParams)

                this.props.getJalurPPDB({...this.state.routeParams, jalur_id: null}).then((result)=>{

                    this.props.getCalonPesertaDidik({...this.state.routeParams, sekolah_id:null}).then((result)=>{
                        this.setState({
                            routeParams: {
                                ...result.payload.rows[0],
                                ...this.state.routeParams
                            }
                        },()=>{
                            this.props.getSekolahPilihan({...this.state.routeParams, peserta_didik_id: this.$f7route.params['peserta_didik_id']}).then((result)=>{
    
                                let jalur_id = this.state.jalur_id
    
                                if(result.payload.total > 0){
                                    jalur_id = result.payload.rows[0].jalur_id
                                }
    
                                this.setState({
                                    sekolah_pilihan: result.payload,
                                    jalur_id: jalur_id
                                },()=>{
                                    console.log(this.state.jalur_id)

                                    this.$f7.dialog.close()

                                    //nilai prestasi
                                    this.props.getNilaiPrestasi(this.state.routeParams).then((result)=>{
                                        if(result.payload.total > 0){
                                            this.setState({
                                                jenis_prestasi_id: result.payload.rows[0].jenis_prestasi_id,
                                                tingkat_prestasi_id: result.payload.rows[0].tingkat_prestasi_id,
                                                nilai_semester_1: result.payload.rows[0].nilai_semester_1,
                                                nilai_semester_2: result.payload.rows[0].nilai_semester_2,
                                                nilai_semester_3: result.payload.rows[0].nilai_semester_3,
                                                nilai_semester_4: result.payload.rows[0].nilai_semester_4,
                                                nilai_semester_5: result.payload.rows[0].nilai_semester_5
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

    }

    setFieldValue = (tipe) => (e) => {
        this.setState({
            ...this.state,
            [tipe]: e.currentTarget.value
        },()=>{
          console.log(this.state.routeParams)
        })
    }

    tambahSekolah = () => {
        // alert('tes')

        if(this.state.sekolah_pilihan.total < 5){
            //masih boleh
            this.$f7router.navigate("/pilihSekolahPilihan/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']+'/'+this.state.jalur_id+'/'+(parseInt(this.state.sekolah_pilihan.total)+1))
        }else{
            //udh nggak boleh
            this.$f7.dialog.alert('Mohon maaf, Anda hanya dapat memilih maksimal 4 sekolah', 'Peringatan')
        }

    }

    simpan = () => {

        if(this.state.sekolah_pilihan.total < 4){
            //nggak boleh
            this.$f7.dialog.alert('Mohon maaf, mohon lengkapi pilihan sekolah Pendaftar ini hingga 4 sekolah sebelum melanjutkan!', 'Peringatan')
        }else{
            //boleh
            this.$f7.dialog.preloader()
            
            this.props.simpanSekolahPilihan({peserta_didik_id: this.$f7route.params['peserta_didik_id'], jalur_id: this.state.jalur_id}).then((result)=> {
    
                this.props.simpanNilaiPrestasi({
                    pengguna_id: this.$f7route.params['pengguna_id'],
                    peserta_didik_id: this.$f7route.params['peserta_didik_id'],
                    jenis_prestasi_id: this.state.jenis_prestasi_id,
                    tingkat_prestasi_id: this.state.tingkat_prestasi_id,
                    nilai_semester_1: this.state.nilai_semester_1,
                    nilai_semester_2: this.state.nilai_semester_2,
                    nilai_semester_3: this.state.nilai_semester_3,
                    nilai_semester_4: this.state.nilai_semester_4,
                    nilai_semester_5: this.state.nilai_semester_5
                }).then((result)=>{
    
                    this.$f7.dialog.close()
                    this.$f7router.navigate("/formBerkas/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']+'/'+this.state.jalur_id)
    
                })
    
            })
        }

      }

    hapusSekolah = (sekolah_id) => (e) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus sekolah ini?', 'Konfirmasi', () => {
            this.props.simpanSekolahPilihan({
                peserta_didik_id: this.$f7route.params['peserta_didik_id'],
                sekolah_id: sekolah_id,
                soft_delete: 1
            }).then((result)=>{
                this.props.getSekolahPilihan(this.state.routeParams).then((result)=>{

                    let jalur_id = this.state.jalur_id

                    if(result.payload.total > 0){
                        jalur_id = result.payload.rows[0].jalur_id
                    }

                    this.setState({
                        sekolah_pilihan: result.payload,
                        jalur_id: jalur_id
                    })
                })
            })
        })
    }

    simpanNilaiPrestasi = (kolom) => (e) => {
        console.log(kolom)
        console.log(e.currentTarget.value)

        this.setState({
            [kolom]: e.currentTarget.value
        },()=>{
            console.log(this.state[kolom])
        })
    }

    render()
    {
        return (
          <Page name="formSekolahPilihan" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

            <div className="cardAtas" style={{marginBottom:'50px'}}>
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="15"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="70">
                    <Row noGap>
                        <Col width="100" tabletWidth="100">
                            <HeaderSekolahPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah={this.state.sekolah} f7={this} />
                        </Col>
                        <Col width="0" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent padding={false}>
                                <Segmented className="steps color-theme-deeporange" raised style={{borderRadius:'20px'}}>
                                <Button disabled={false} onClick={()=>this.$f7router.navigate("/formBiodata/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} style={{borderRadius:'20px 0px 0px 20px'}}>Biodata</Button>
                                <Button tabLinkActive>Jalur dan Pilihan Sekolah</Button>
                                <Button disabled={true}>Kelengkapan Berkas</Button>
                                <Button disabled={true}>Konfirmasi</Button>
                                </Segmented>
                            </CardContent>
                        </Card>
                        </Col>
                        <Col width="100" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100">
                                        <Card>
                                            <CardHeader>
                                                <b>Jalur PPDB</b>
                                            </CardHeader>
                                            <CardContent>
                                                <List>
                                                    <ListInput
                                                        // label="Jenis Kelamin"
                                                        type="select"
                                                        value={this.state.jalur_id}
                                                        placeholder="Pilih Jalur PPDB..."
                                                        onChange={this.setFieldValue('jalur_id')}
                                                    >
                                                        <option value={"0"} disabled>-</option>
                                                        {this.props.jalur.rows.map((option)=>{

                                                            let waktu_mulai = ''
                                                            waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY');
                                                            
                                                            let waktu_selesai = ''
                                                            waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY');

                                                            let hari_ini = new Date()

                                                            // if(hari_ini >= option.waktu_selesai)

                                                            return (
                                                                <option value={option.jalur_id}>{option.nama} ({waktu_mulai} - {waktu_selesai})</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    {this.state.jalur_id === '0300' &&
                                    <Col width="100" tabletWidth="50">
                                        <Card>
                                            <CardHeader>
                                                <b>Jenis Prestasi</b>
                                            </CardHeader>
                                            <CardContent>
                                                <List>
                                                    <ListInput
                                                        type="select"
                                                        value={this.state.jenis_prestasi_id}
                                                        placeholder="Pilih Prestasi..."
                                                        onChange={this.simpanNilaiPrestasi('jenis_prestasi_id')}
                                                    >
                                                        <option value={"0"} disabled>-</option>
                                                        {this.props.jenis_prestasi.rows.map((option)=>{
                                                            return (
                                                                <option value={option.jenis_prestasi_id}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    }
                                    {this.state.jalur_id === '0300' &&
                                    <Col width="100" tabletWidth="50">
                                        <Card>
                                            <CardHeader>
                                                <b>Peringkat/Nilai Prestasi</b>
                                            </CardHeader>
                                            <CardContent>
                                                {parseInt(this.state.jenis_prestasi_id) !== 3 &&
                                                <List>
                                                    <ListInput
                                                        type="select"
                                                        value={this.state.tingkat_prestasi_id}
                                                        placeholder="Pilih Peringkat Prestasi..."
                                                        onChange={this.simpanNilaiPrestasi('tingkat_prestasi_id')}
                                                    >
                                                        <option value={"0"} disabled>-</option>
                                                        {this.props.tingkat_prestasi.rows.map((option)=>{
                                                            return (
                                                                <option value={option.tingkat_prestasi_id}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                </List>
                                                }
                                                {parseInt(this.state.jenis_prestasi_id) === 3 &&
                                                <Row noGap>
                                                    <Col width="50">
                                                        <List>
                                                            <ListInput
                                                                label="Nilai Rapor Semester 7"
                                                                type="number"
                                                                value={this.state.nilai_semester_1}
                                                                placeholder="Semester 1..."
                                                                onChange={this.simpanNilaiPrestasi('nilai_semester_1')}
                                                                // info="Sesuai rapor sekolah"
                                                            />
                                                            <ListInput
                                                                label="Nilai Rapor Semester 8"
                                                                type="number"
                                                                value={this.state.nilai_semester_2}
                                                                placeholder="Semester 2..."
                                                                onChange={this.simpanNilaiPrestasi('nilai_semester_2')}
                                                                // info="Sesuai rapor sekolah"
                                                            />
                                                            <ListInput
                                                                label="Nilai Rapor Semester 9"
                                                                type="number"
                                                                value={this.state.nilai_semester_3}
                                                                placeholder="Semester 3..."
                                                                onChange={this.simpanNilaiPrestasi('nilai_semester_3')}
                                                                // info="Sesuai rapor sekolah"
                                                            />
                                                        </List>
                                                    </Col>
                                                    <Col width="50">
                                                        <List>
                                                            <ListInput
                                                                label="Nilai Rapor Semester 10"
                                                                type="number"
                                                                value={this.state.nilai_semester_4}
                                                                placeholder="Semester 4..."
                                                                onChange={this.simpanNilaiPrestasi('nilai_semester_4')}
                                                                // info="Sesuai rapor sekolah"
                                                            />
                                                            <ListInput
                                                                label="Nilai Rapor Semester 11"
                                                                type="number"
                                                                value={this.state.nilai_semester_5}
                                                                placeholder="Semester 5..."
                                                                onChange={this.simpanNilaiPrestasi('nilai_semester_5')}
                                                                // info="Sesuai rapor sekolah"
                                                            />
                                                        </List>
                                                    </Col>
                                                </Row>
                                                }
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    }
                                    {this.state.jalur_id === '0300' &&
                                    <Col width="100" tabletWidth="100" style={{fontSize:'12px', padding:'16px'}}>
                                        *) Jenis dan peringkat/nilai prestasi hanya dipilih jika jalur PPDB yang diambil adalah jalur prestasi
                                    </Col>
                                    }
                                    <Col width="100">
                                        <Card>
                                            <CardHeader>
                                                Sekolah Pilihan
                                            </CardHeader>
                                            <CardContent>
                                                <Card style={{marginLeft:'0px', marginTop:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            <Col width="15" tabletWidth="10" style={{textAlign:'center'}}>
                                                                <i className="icons f7-icons" style={{fontSize:'40px', color:'#434343'}}>info_circle</i>
                                                            </Col>
                                                            <Col width="85" tabletWidth="90" style={{color:'#434343'}}>
                                                                Jumlah minimal sekolah yang dipilih adalah <b>4 sekolah</b>, dengan pilihan sekolah pertama hingga ketiga adalah sekolah negeri, dan sekolah keempat harus berstatus <b>sekolah swasta</b>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>

                                                <Button onClick={this.tambahSekolah} disabled={this.state.routeParams.jalur_id !== "0" ? false : true} raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginBottom:'8px'}}>
                                                    <i className="f7-icons">plus</i>&nbsp;
                                                    Tambah Sekolah Pilihan
                                                </Button>
                                                <br/>
                                                {this.state.routeParams.jalur_id !== "0" ? <></> : <span style={{fontSize:'12px'}}>Mohon pilih jalur PPDB terlebih dahulu</span>}
                                                        
                                                <div style={{marginTop: '8px', marginBottom: '8px', minHeight:'100px', border:'2px dashed #ccc', borderRadius:'20px', padding:'8px'}}>
                                                    {this.state.sekolah_pilihan.total < 1 &&
                                                    <div style={{width:"100%", textAlign:'center'}}>
                                                        <img src="./static/icons/6671.jpg" style={{height:'200px'}} />
                                                        <br/>
                                                        Silakan tambah sekolah pilihan
                                                    </div>
                                                    }
                                                    {this.state.sekolah_pilihan.total > 0 &&
                                                    <div style={{width:"100%"}}>
                                                        {this.state.sekolah_pilihan.rows.map((option)=>{
                                                            return (
                                                                <Card key={option.sekolah_id} style={{marginRight:'0px', marginLeft:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <Row>
                                                                            <Col width="15" tabletWidth="10" desktopWidth="10" style={{textAlign:'center', fontSize:'10px'}}>
                                                                                Pilihan
                                                                                <br/>
                                                                                <span style={{fontSize:'20px'}}>#{option.urut_pilihan}</span>
                                                                            </Col>
                                                                            <Col width="25" tabletWidth="15" desktopWidth="10">
                                                                                <div className="fotoSekolah" style={{backgroundImage: "url(http://foto.data.kemdikbud.go.id/getImage/" + option.npsn + "/1.jpg)", backgroundSize:'cover', backgroundPosition:'center'}}>
                                                                                    &nbsp;
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="60" tabletWidth="55" desktopWidth="60" style={{paddingLeft:'4px'}}>
                                                                                <b>{option.nama}</b> ({option.npsn})
                                                                                <br/>
                                                                                <span style={{fontSize:'10px'}}>
                                                                                    {option.alamat}{option.kecamatan ? <>, {option.kecamatan}</> : <></>}{option.kabupaten ? <>, {option.kabupaten}</> : <></>}{option.provinsi ? <>, {option.provinsi}</> : <></>}
                                                                                </span>
                                                                                {/* <br/> */}
                                                                                {/* <span style={{fontSize:'10px'}}>
                                                                                    {option.bentuk} | {parseInt(option.status_sekolah) === 1 ? 'Negeri' : 'Swasta'}
                                                                                </span> */}
                                                                            </Col>
                                                                            <Col width="80" tabletWidth="15" desktopWidth="15">
                                                                                <div style={{fontSize:'8px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'20px', marginTop:'8px', padding:'4px', paddingRight:'4px', margin:'4px'}}>
                                                                                    Jarak Rumah-Sekolah
                                                                                    <br/>
                                                                                    <span style={{fontSize:'16px', fontWeight:'bold'}}>{parseFloat(option.jarak) <= 50 ? parseFloat(option.jarak).toFixed(2) : '> 50'}</span> km
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="20" tabletWidth="5" desktopWidth="5" style={{marginTop:'8px'}}>
                                                                                <Button onClick={this.hapusSekolah(option.sekolah_id)}>
                                                                                    <i className="f7-icons" style={{fontSize:'20px'}}>trash</i>
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        })}
                                                    </div>
                                                    }
                                                </div>
                                            
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100" style={{textAlign:'right', marginBottom:'16px'}}>
                                        <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpan}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                            Simpan dan Lanjut
                                        </Button>
                                    </Col>          
                                </Row>

                            </CardContent>
                        </Card>
                        </Col>
                    </Row>
                  </Col>
                  <Col width="0" tabletWidth="5" desktopWidth="15"></Col>
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
        getSekolahPilihan: Actions.getSekolahPilihan,
        simpanSekolahPilihan: Actions.simpanSekolahPilihan,
        getJenisPrestasi: Actions.getJenisPrestasi,
        getTingkatPrestasi: Actions.getTingkatPrestasi,
        simpanNilaiPrestasi: Actions.simpanNilaiPrestasi,
        getNilaiPrestasi: Actions.getNilaiPrestasi
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, PPDB }) {
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
        jenis_prestasi: PPDB.jenis_prestasi,
        tingkat_prestasi: PPDB.tingkat_prestasi,
        nilai_prestasi: PPDB.nilai_prestasi
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(formSekolahPilihan);