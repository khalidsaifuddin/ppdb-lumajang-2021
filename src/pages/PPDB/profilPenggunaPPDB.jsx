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

class profilPenggunaPPDB extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          error: null,
          loading: true,
          show: {
            provinsi: 'block',
            kabupaten: 'none',
          },
          pengguna: {
            rows: [{
              pengguna_id: '---',
            }],
            total: 0,
          },
          data: {},
          set_password: false,
          set_peran_id: false,
          file_gambar_ktp: '',
          file_gambar_sk: '',
          gambar_ktp: '',
          gambar_sk: '',
          untungLangganan: false
        }
      }
      
      componentDidMount = () => {
        this.setState({
          data: {},
          routeParams: {
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse( localStorage.getItem('user') ).pengguna_id,
            id_level_wilayah: 1,
          }
        }, ()=> {
          this.props.getPengguna(this.state.routeParams).then((result)=> {
            this.setState({
              ...this.state,
              loading: false,
              pengguna:  this.props.pengguna,
              set_password: (this.props.pengguna.rows[0].password === null ? false : true),
              set_peran_id: (this.props.pengguna.rows[0].peran_id === null ? false : true),
            });
          }, ()=> {
            // console.log(this.state.pengguna);
          });
    
          this.props.getProvinsi(this.state.routeParams).then((result)=> {});
        });
      }
    
      backClick = () => {
        let properti = 'beranda';
    
        for (var property in this.props.tabBar) {
          this.props.tabBar[property] = false;
        }
    
        if(this.props.f7router.url.replace("/","").replace("/","") !== "") {
          properti = this.props.f7router.url.replace("/","").replace("/","");
        }
    
        this.props.tabBar[properti] = true;
    
        this.props.setTabActive(this.props.tabBar);
      }
    
      gantiTab = (kode) => {}
    
      setValue = (kolom) => (e) => {
        if(!this.$f7route.params['pengguna_id']) {
          this.setState({
            ...this.state,
            pengguna:{
              ...this.state.pengguna,
              rows: [{
                ...this.state.pengguna.rows[0],
                [kolom]: e.target.value,
              }],
            },
            data:{
              ...this.state.data,
              [kolom]: e.target.value,
            }
          }, ()=> {
            // console.log(this.state);
          });
        }
      }
    
      cancelConfirm = () => {
        alert('nggak jadi');
      }
    
      simpanPengguna = () => {
        if(typeof(this.state.data.peran_id) !== 'undefined') {
          this.$f7.dialog.confirm('Pastikan peran dan wilayah Anda telah sesuai. Isian Anda tidak akan bisa diubah setelah tersimpan', 'Perhatian', () => {
            this.setState({
              loading: true,
              routeParams:{
                ...this.state.routeParams,
                pengguna_id: this.state.pengguna.rows[0].pengguna_id,
                data: this.state.data,
              }
            }, ()=> {
              this.props.setPengguna(this.state.routeParams).then((result)=> {
                // this.setState({
                //   loading: false,
                // }, ()=> {
                //   //todo
                // });
    
                // if(result.payload.status === 'berhasil') {
                  this.props.getPengguna(this.state.routeParams).then((resultss)=>{
    
                  });
    
                  if(this.state.routeParams.password !== null){
                    this.setState({
                      set_password: true,
                      loading: false
                    },()=>{
                      console.log(this.state);
                      this.$f7.dialog.alert('Perubahan berhasil disimpan!', 'Berhasil');
                    });
                  }
    
                  // console.log(localStorage.getItem('user'));
    
                  // let jsonPengguna = JSON.parse(localStorage.getItem('user'));
    
                  // jsonPengguna.nama = this.state.data.nama;
    
                  // console.log(jsonPengguna);
    
                  // localStorage.setItem('user', JSON.stringify(jsonPengguna));
    
                  // let sp= false;
                  // let spi= false;
    
                  // if(this.state.routeParams.password) {
                  //   sp= true;
                  // }
    
                  // if(this.state.data.peran_id && this.state.data.kode_wilayah) {
                  //   spi= true;
                  // }
    
                  // this.setState({
                  //   ...this.state,
                  //   set_password: sp,
                  //   set_peran_id: spi,
                  // });
                // } else {
                //   this.$f7.dialog.alert('Perubahan gagal disimpan! Silakan coba beberapa saat lagi', 'Gagal');
                //   this.setState({
                //     loading: false
                //   });
                // }
              })
            });
          });
        } else {
          this.setState({
            loading: true,
            routeParams: {
              ...this.state.routeParams,
              pengguna_id: this.state.pengguna.rows[0].pengguna_id,
              data: this.state.data,
            }
          }, ()=> {
    
            // if(this.state.routeParams.password_lama){
    
            // }
    
            this.props.setPengguna(this.state.routeParams).then((result)=> {
              this.setState({
                loading: false,
              }, ()=> {
                if(result.payload.status === 'berhasil') {
                  this.$f7.dialog.alert('Perubahan berhasil disimpan!', 'Berhasil');
    
                  this.props.getPengguna(this.state.routeParams).then((resultsss)=>{
                    localStorage.setItem('user', JSON.stringify(this.props.pengguna.rows[0]));
                    
                    let jsonPengguna = JSON.parse(localStorage.getItem('user'));
      
                    jsonPengguna.nama = this.state.data.nama;
      
                    // console.log(jsonPengguna);
                    if(this.state.routeParams.password !== null){
                      this.setState({
                        set_password: true,
                        loading: false
                      },()=>{
                        console.log(this.state);
                        // this.$f7.dialog.alert('Perubahan berhasil disimpan!', 'Berhasil');
                      });
                    }
                  });
    
    
                  // localStorage.setItem('user', JSON.stringify(jsonPengguna));
                  
                } else {
                  if(result.payload.pesan === 'password_tidak_sama') {
                    this.$f7.dialog.alert('Password lama tidak sesuai! Mohon coba lagi', 'Gagal');
                  }else{
    
                    this.$f7.dialog.alert('Perubahan gagal disimpan! Silakan coba beberapa saat lagi', 'Gagal');
                  }
    
                }
              })
            })
          });
        }
      }
    
      gantiPeran = (b) => {
        let tampilKab = 'block';
    
        if(parseInt(b.target.value) === 6) {
          tampilKab = 'none';
        } else if(parseInt(b.target.value) === 54) {
          tampilKab = 'none';
        } else if(parseInt(b.target.value) === 8) {
          tampilKab = 'block';
        } else if(parseInt(b.target.value) === 1) {
          tampilKab = 'none';
        }
    
        this.setState({
          ...this.state,
          show: {
            ...this.state.show,
            kabupaten: tampilKab,
          },
          pengguna: {
            ...this.state.pengguna,
            rows: [{
              ...this.state.pengguna.rows[0],
              peran_id: b.target.value,
            }]
          },
          data:{
            ...this.state.data,
            peran_id: b.target.value,
          },
        }, ()=> {});
      }
    
      setParamValue = (b) => {
        this.setState({
          ...this.state,
          routeParams: {
            ...this.state.routeParams,
            params_wilayah: b.target.getAttribute('name'),
            [b.target.getAttribute('name')]: b.target.value,
          },
          pengguna: {
            ...this.state.pengguna,
            rows: [{
              ...this.state.pengguna.rows[0],
              kode_wilayah: b.target.value.trim(),
            }]
          },
          data: {
            ...this.state.data,
            kode_wilayah: b.target.value.trim(),
          }
        }, ()=> {
          if(this.state.routeParams.params_wilayah === 'propinsi'){
            this.setState({
              ...this.state,
              routeParams: {
                id_level_wilayah: 2,
                mst_kode_wilayah: this.state.routeParams.propinsi.trim(),
              }
            }, ()=> {
              this.props.getKabupaten(this.state.routeParams).then((result)=> {
                // console.log(this.state);
              });
            });
          }
        });
      }
    
      uploadBerhasil = (xhr) => {
        let response = JSON.parse(xhr.currentTarget.responseText);
    
        if(response.msg == 'sukses'){
          this.setState({
            file_gambar_ktp: response.filename,
            loading: false,
          });
        }
      }
        
      uploadBerhasilSk = (xhr) => {
        let response = JSON.parse(xhr.currentTarget.responseText);
    
        if(response.msg == 'sukses') {
          this.setState({
            file_gambar_sk: response.filename,
            loading: false,
          });
        }
      }
    
      uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistema atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
      }
    
      acceptedFile = (file) => {
        if(file[0].size >= 1000000) {
          this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
    
          return true;
        }
    
        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png') {
          this.setState({
            gambar_ktp: file[0].name,
            data: {
              ...this.state.data,
              verified: 10,
            }
          }, ()=> {
            return new Promise(
              (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                xhr.onload = this.uploadBerhasil;
                xhr.onerror = this.uploadGagal;
                const data = new FormData();
                data.append('image', file[0]);
                data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                data.append('jenis', 'gambar_ktp');
                xhr.send(data);
              }
            );
          });
        } else {
          this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
          
          return true;
        }
      }
    
      acceptedFileSk = (file) => {
        if(file[0].size >= 1000000) {
          this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
          
          return true;
        }
    
        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png') {
          this.setState({
            gambar_sk: file[0].name,
            data:{
              ...this.state.data,
              verified: 10,
            }
          }, ()=> {
            return new Promise(
              (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                xhr.onload = this.uploadBerhasilSk;
                xhr.onerror = this.uploadGagal;
                const data = new FormData();
                data.append('image', file[0]);
                data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                data.append('jenis', 'gambar_sk');
                xhr.send(data);
              }
            );
          });
        } else {
          this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
          
          return true;
        }
      }
    
      untungLangganan = () => {
        this.setState({untungLangganan:!this.state.untungLangganan})
      }

    render()
    {
        return (
          <Page name="profilPenggunaPPDB" hideBarsOnScroll>
            
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
                                
                                <BlockTitle style={{marginTop:"0px", marginBottom:'8px'}}>Kelengkapan Berkas untuk Jalur {this.state.jalur.nama}</BlockTitle>
                                <Row>
                                    <Col width="100" tabletWidth="30">
                                        <Card style={{marginRight:'4px', marginLeft:'0px'}}>
                                            <CardContent>
                                                {this.state.jalur_berkas.rows.map((option)=>{
                                                    if((parseInt(this.state.jalur_berkas.rows.indexOf(option))+1) === 1){
                                                        return (
                                                            <>
                                                                <Link key={option.jenis_berkas_id} style={{marginBottom:'8px'}} tabLinkActive tabLink={"#tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)}>
                                                                    {option.nama_file &&
                                                                    <i className="f7-icons" style={{color:'green', fontSize:'20px'}}>checkmark_alt_circle_fill</i>
                                                                    }
                                                                    {!option.nama_file &&
                                                                    <i className="f7-icons" style={{color:'gray', fontSize:'20px'}}>circle</i>
                                                                    }
                                                                    &nbsp;{option.nama}
                                                                </Link>
                                                                <br/>
                                                            </>
                                                        )
                                                    }else{
                                                        return (
                                                            <>
                                                                <Link key={option.jenis_berkas_id} style={{marginBottom:'8px'}} tabLink={"#tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)}>
                                                                {option.nama_file &&
                                                                    <i className="f7-icons" style={{color:'green', fontSize:'20px'}}>checkmark_alt_circle_fill</i>
                                                                    }
                                                                    {!option.nama_file &&
                                                                    <i className="f7-icons" style={{color:'gray', fontSize:'20px'}}>circle</i>
                                                                    }
                                                                    &nbsp;{option.nama}
                                                                </Link>
                                                                <br/>
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
                                                                    <BlockTitle style={{marginTop:'8px', marginBottom:'8px', marginLeft:'0px'}}>
                                                                        {option.nama}
                                                                    </BlockTitle>
                                                                    {/* <br/> */}
                                                                    {typeof(this.state.berkas_calon[option.jenis_berkas_id]) !== 'undefined' &&
                                                                    <Dropzone className="droping" onDrop={this.acceptedFile(option.jenis_berkas_id)}>
                                                                    {({getRootProps, getInputProps}) => (
                                                                        <section>
                                                                            <div {...getRootProps()} style={{borderRadius:'20px', height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                                                <input {...getInputProps()} />
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar === '' &&
                                                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' &&
                                                                                <>
                                                                                <img style={{height:'150px'}} src={"https://be.diskuis.id"+this.state.berkas_calon[option.jenis_berkas_id].file_gambar+"?"+this.state.imageHash} />
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1 MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].gambar === '' &&
                                                                                <>
                                                                                <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 10 MB, dan hanya dalam format .jpg, atau .png</p>
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
                                                                    </Dropzone>
                                                                    }
                                                                </Tab>
                                                            )

                                                        }else{
                                                            //yang berikutnya
                                                            return (
                                                                <Tab id={"tab-"+(parseInt(this.state.jalur_berkas.rows.indexOf(option))+1)} className="page-content">
                                                                    <BlockTitle style={{marginTop:'8px', marginBottom:'8px', marginLeft:'0px'}}>
                                                                        {option.nama}
                                                                    </BlockTitle>
                                                                    {/* <br/> */}
                                                                    {typeof(this.state.berkas_calon[option.jenis_berkas_id]) !== 'undefined' &&
                                                                    <Dropzone className="droping" onDrop={this.acceptedFile(option.jenis_berkas_id)}>
                                                                    {({getRootProps, getInputProps}) => (
                                                                        <section>
                                                                            <div {...getRootProps()} style={{borderRadius:'20px', height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                                                <input {...getInputProps()} />
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar === '' &&
                                                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].file_gambar !== '' &&
                                                                                <>
                                                                                <img style={{height:'150px'}} src={"https://be.diskuis.id"+this.state.berkas_calon[option.jenis_berkas_id].file_gambar+"?"+this.state.imageHash} />
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 10 MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].gambar === '' &&
                                                                                <>
                                                                                <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 10 MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                                {this.state.berkas_calon[option.jenis_berkas_id].gambar !== '' && this.state.berkas_calon[option.jenis_berkas_id].file_gambar === '' &&
                                                                                <>
                                                                                <p style={{fontSize:'20px'}}>{this.state.berkas_calon[option.jenis_berkas_id].gambar}</p>
                                                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 10 MB, dan hanya dalam format .jpg, atau .png</p>
                                                                                </>
                                                                                }
                                                                            </div>
                                                                        </section>
                                                                    )}
                                                                    </Dropzone>
                                                                    }
                                                                </Tab>
                                                            )

                                                        }

                                                    })}
                                                </Tabs>
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
        simpanBerkasCalon: Actions.simpanBerkasCalon
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

export default connect(mapStateToProps, mapDispatchToProps)(profilPenggunaPPDB);