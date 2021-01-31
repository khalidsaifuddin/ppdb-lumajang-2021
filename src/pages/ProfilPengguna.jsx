import React, { Component } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  Block,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  ListInput,
  Progressbar,
  Segmented,
  Popup,
  NavRight,
  Link
} from 'framework7-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import Dropzone from 'react-dropzone';

class ProfilPengguna extends Component {
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

  render() {
    return (
      <Page name="ProfilPengguna" hideBarsOnScroll>
        <Popup
          className="demo-popup"
          opened={this.state.untungLangganan}
          onPopupClosed={()=>this.setState({untungLangganan:!this.state.untungLangganan})}
        >
          <Page>
            <Navbar title="Keuntungan Berlangganan">
              <NavRight>
                <Link popupClose>Tutup</Link>
              </NavRight>
            </Navbar>
            <div strong style={{marginTop:'0px', marginBottom:'0px'}}>
              
            </div>
          </Page>
        </Popup>
        
        <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
          <NavTitle sliding>Profil Pengguna</NavTitle>
        </Navbar>
        {this.state.loading &&
          <Progressbar className="profileProgress" infinite color="blue" />
        }
            <Block className="userProfile">
              <Row>
                <Col width="100" tabletWidth="30">
                  <Card className="userImage" noShadow noBorder style={{borderRadius:'20px', marginBottom:'8px'}}>
                    <CardContent padding={false}>
                      <div className="bgUserWrap">
                        <div className="bgUserImage" style={{backgroundImage: 'url('+ JSON.parse(localStorage.getItem('user')).gambar +')'}}></div>
                      </div>
                      <img src={JSON.parse(localStorage.getItem('user')).gambar} />
                      <Button style={{width:'100%', textAlign:'center', marginTop:'4px', display:'inline-flex', fontSize:'12px'}}>
                        {/* <i className="icons f7-icons" style={{fontSize:'15px'}}>pencil</i> */}
                        <Link href={"/gantiGambar/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>
                          Edit Gambar
                        </Link>
                      </Button>
                      <div className="userNameBlock">
                        {this.state.loading ? (
                          <>
                            <h1 className="skeleton-text skeleton-effect-blink">Nama Pengguna</h1>
                            <span className="skeleton-text skeleton-effect-blink">Email Pengguna</span>
                          </>
                        ) : (
                          <>
                            <h1 style={{fontSize:'16px'}}>{this.state.pengguna.rows[0].nama}</h1>
                            <span>{this.state.pengguna.rows[0].username}</span>
                          </>
                        )}
                        {/* {!this.$f7route.params['pengguna_id'] && 
                          <Button disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                        } */}
                      </div>
                    </CardContent>
                  </Card>

                  {/* gratis */}
                  {/* <Card className="hilangDiDesktop" style={{marginLeft:'0px', marginRight:'0px', marginTop:'0px'}}>
                    <CardContent style={{textAlign:'center'}}>
                      <div className="boxGratis">
                        <div class="namaPaket">
                          <img src="/static/icons/free.png" style={{width:'80px'}} />
                          <br/>
                          Gratis
                          <br/>
                        </div>
                      </div>
                      <Row noGap>
                        <Col width="100">
                          <Row>
                            <Col width="100" tabletWidth="50">
                              <Button raised style={{margin:"8px"}} onClick={this.untungLangganan}>
                                Keuntungan Berlangganan
                              </Button>
                            </Col>
                            <Col width="100" tabletWidth="50">
                              <Button raised fill style={{margin:"8px"}} onClick={()=>this.$f7router.navigate('/formBerlangganan/')}>
                                Berlangganan Sekarang
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card> */}

                  <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                    <CardContent>
                      <Button style={{borderRadius:'20px'}} className="color-theme-deeporange" tabLink="#tab-1" tabLinkActive>Identitas</Button>
                      <Button style={{borderRadius:'20px'}} className="color-theme-deeporange" tabLink="#tab-3">Keamanan</Button>
                      {/* <Button style={{borderRadius:'20px'}} className="color-theme-deeporange" tabLink="#tab-9">Verifikasi</Button>
                      <Button style={{borderRadius:'20px'}} className="color-theme-deeporange" tabLink="#tab-10">Riwayat Transaksi</Button> */}
                    </CardContent>
                  </Card>

                </Col>
                <Col width="100" tabletWidth="70">
                  {/* gratis */}
                  {/* <Card className="hilangDiMobile" style={{marginLeft:'0px', marginRight:'0px', marginTop:'0px'}}>
                    <CardContent style={{textAlign:'center'}}>
                      <div className="boxGratis">
                        <div class="namaPaket">
                          <img src="/static/icons/free.png" style={{width:'80px'}} />
                          <br/>
                          Gratis
                          <br/>
                        </div>
                      </div>
                      <Row noGap>
                        <Col width="100">
                          <Row>
                            <Col width="100" tabletWidth="50">
                              <Button raised style={{margin:"8px"}} onClick={this.untungLangganan}>
                                Keuntungan Berlangganan
                              </Button>
                            </Col>
                            <Col width="100" tabletWidth="50">
                              <Button raised fill style={{margin:"8px"}} onClick={()=>this.$f7router.navigate('/formBerlangganan/')}>
                                Berlangganan Sekarang
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card> */}

                  {/* premium */}
                  {/* <Card style={{marginLeft:'0px', marginRight:'0px', marginTop:'0px'}}>
                    <CardContent style={{textAlign:'center'}}>
                      <div className="boxPremium">
                        <div class="namaPaket">
                          <img src="/static/icons/vip.png" style={{width:'80px'}} />
                          <br/>
                          Sekolah Premium
                          <br/>
                          <span style={{fontSize:'18px'}}>MTS Banyuputih</span>
                        </div>
                      </div>
                      <Row noGap>
                        <Col width="50">
                          <div className="keteranganPaket">
                            Berlaku sampai dengan
                            <br/>
                            <b>31 Juli 2020, 23:59</b>
                            <br/>
                          </div>
                        </Col>
                        <Col width="50">
                          <div className="keteranganPaket">
                            Metode Pembayaran
                            <br/>
                            <b>Transfer Bank</b>
                          </div>
                        </Col>
                        <Col width="100">
                          <Row>
                            <Col width="50">
                              <Button raised style={{margin:"8px"}}>
                                Keterangan Berlangganan
                              </Button>
                            </Col>
                            <Col width="50">
                              <Button raised fill style={{margin:"8px"}}>
                                Perpanjang Berlangganan
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card> */}

                  {/* premium free */}
                  {/* <Card style={{marginLeft:'0px', marginRight:'0px', marginTop:'0px'}}>
                    <CardContent style={{textAlign:'center'}}>
                      <div className="boxPremium">
                        <div class="namaPaket">
                          <img src="/static/icons/vip.png" style={{width:'80px'}} />
                          <br/>
                          Sekolah Premium Gratis
                          <br/>
                          <span style={{fontSize:'18px'}}>MTS Banyuputih</span>
                        </div>
                      </div>
                      <Row noGap>
                        <Col width="50">
                          <div className="keteranganPaket">
                            Berlaku sampai dengan
                            <br/>
                            <b>31 Juli 2020, 23:59</b>
                            <br/>
                          </div>
                        </Col>
                        <Col width="50">
                          <div className="keteranganPaket">
                            Metode Pembayaran
                            <br/>
                            <b>Transfer Bank</b>
                          </div>
                        </Col>
                        <Col width="100">
                          <Row>
                            <Col width="50">
                              <Button raised style={{margin:"8px"}}>
                                Keterangan Berlangganan
                              </Button>
                            </Col>
                            <Col width="50">
                              <Button raised fill style={{margin:"8px"}}>
                                Perpanjang Berlangganan
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardContent>
                  </Card> */}

                  {/* <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                      <Segmented raised>
                          <Button className="color-theme-deeporange" tabLink="#tab-1" tabLinkActive>Identitas</Button>
                          <Button className="color-theme-deeporange" tabLink="#tab-3" >Keamanan</Button>
                      </Segmented>
                  </Block> */}
                  {/* <Card className="hilangDiDesktop" style={{marginLeft:'0px', marginRight:'0px'}}>
                    <CardContent>
                      <Button className="color-theme-deeporange" tabLink="#tab-1">Identitas</Button>
                      <Button className="color-theme-deeporange" tabLink="#tab-3">Keamanan</Button>
                    </CardContent>
                  </Card> */}

                  <Tabs>
                    <Tab id="tab-1" className="page-content no-padding-top no-padding-bottom" tabActive>

                      <Card className="userDesc" noShadow noBorder style={{borderRadius:'20px'}}>
                        <CardContent padding={false}>
                          <List inlineLabels noHairlinesMd>
                            <ListInput
                              label="Nama"
                              type="text"
                              placeholder="Nama"
                              clearButton
                              value={this.state.pengguna.rows[0].nama || ''}
                              onChange={this.setValue('nama')}
                            >
                              <i slot="media" className="f7-icons">person_fill</i>
                            </ListInput>
                            <ListInput
                              label="NIK"
                              type="number"
                              placeholder="NIK"
                              clearButton
                              value={this.state.pengguna.rows[0].nik || ''}
                              onChange={this.setValue('nik')}
                            >
                              <i slot="media" className="f7-icons">creditcard_fill</i>
                            </ListInput>
                            <ListInput
                              label="Alamat Rumah"
                              type="text"
                              placeholder="Alamat Rumah"
                              clearButton
                              value={this.state.pengguna.rows[0].alamat || ''}
                              onChange={this.setValue('alamat')}
                            >
                              <i slot="media" className="f7-icons">house_alt_fill</i>
                            </ListInput>
                            {/* <ListInput
                              label="Instansi/Sekolah"
                              type="text"
                              placeholder="Instansi/Sekolah"
                              clearButton
                              value={this.state.pengguna.rows[0].jabatan_lembaga || ''}
                              onChange={this.setValue('jabatan_lembaga')}
                            >
                              <i slot="media" className="f7-icons">building_2_fill</i>
                            </ListInput> */}
                          </List>
                          <List inlineLabels noHairlinesMd>
                            <ListInput
                              label="Nomor HP"
                              type="text"
                              placeholder="Nomor HP"
                              clearButton
                              value={this.state.pengguna.rows[0].no_hp || ''}
                              onChange={this.setValue('no_hp')}
                            >
                              <i slot="media" className="f7-icons">phone_circle_fill</i>
                            </ListInput>
                            <ListInput
                              label="Email"
                              type="text"
                              placeholder="Email"
                              clearButton
                              value={this.state.pengguna.rows[0].no_telepon || ''}
                              onChange={this.setValue('no_telepon')}
                            >
                              <i slot="media" className="f7-icons">envelope_fill</i>
                            </ListInput>
                            <ListInput
                              label="Akun Twitter"
                              type="text"
                              placeholder="Twitter"
                              clearButton
                              value={this.state.pengguna.rows[0].ym || ''}
                              onChange={this.setValue('ym')}
                            >
                              <i slot="media" className="f7-icons">logo_twitter</i>
                            </ListInput>
                            <ListInput
                              label="Akun Instagram"
                              type="text"
                              placeholder="Instagram"
                              clearButton
                              value={this.state.pengguna.rows[0].skype || ''}
                              onChange={this.setValue('skype')}
                            >
                              <i slot="media" className="f7-icons">logo_instagram</i>
                            </ListInput>
                            <ListInput
                              label="Akun Google"
                              type="text"
                              placeholder="Akun Google"
                              clearButton
                              value={this.state.pengguna.rows[0].akun_google || ''}
                              onChange={this.setValue('skype')}
                            >
                              <i slot="media" className="f7-icons">logo_google</i>
                            </ListInput>
                          </List>
                        </CardContent>
                      </Card>
                      <div className="profileActions">
                        {!this.$f7route.params['pengguna_id'] && 
                          <Button disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                        }
                      </div>
                    </Tab>
                    <Tab id="tab-2" className="page-content" style={{padding:'0px', overflow:'hidden'}}>
                      {this.state.set_peran_id === false &&
                        <List style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                          <ListItem
                            title="Peran"
                            smartSelect
                          >
                            <select onChange={this.gantiPeran} name="peran_id" defaultValue={"-"}>
                              <option value={"-"} disabled>Pilih Peran</option>
                              <option value={"1"}>Administrator</option>
                              <option value={"54"}>Operator LPMP</option>
                              <option value={"6"}>Operator Disdik Provinsi</option>
                              <option value={"8"}>Operator Disdik Kabupaten/Kota</option>
                            </select>
                          </ListItem>
                          <ListItem
                            title="Provinsi"
                            smartSelect
                            style={{display:this.state.show.provinsi}}
                            smartSelectParams={{searchbar: true, searchbarPlaceholder: 'Cari Provinsi'}}
                          >
                            <select onChange={this.setParamValue} name="propinsi" defaultValue={"-"}>
                              <option value="-" disabled>Pilih Provinsi</option>
                              {parseInt(this.state.data.peran_id) === 1 && <option value="000000">Indonesia</option>}
                              {this.props.provinsi.rows.map((option)=> {
                                return(
                                  <option key={option.kode_wilayah} value={option.kode_wilayah}>{option.nama}</option>
                                )
                              })}
                            </select>
                          </ListItem>
                          <ListItem
                            title="Kabupaten"
                            smartSelect
                            style={{display:this.state.show.kabupaten}}
                            smartSelectParams={{searchbar: true, searchbarPlaceholder: 'Cari Kabupaten'}}
                          >
                            <select onChange={this.setParamValue} name="kabupaten" defaultValue={"-"}>
                              <option value="-">Pilih Kabupaten</option>
                              {this.props.kabupaten.rows.map((option)=> {
                                return(
                                  <option key={option.kode_wilayah} value={option.kode_wilayah}>{option.nama}</option>
                                )
                              })}
                            </select>
                          </ListItem>
                        </List>
                      }
                      {this.state.set_peran_id !== false &&
                        <List inlineLabels noHairlinesMd style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                          <ListInput
                            label="Peran"
                            type="text"
                            placeholder="Peran"
                            clearButton
                            value={this.state.pengguna.rows[0].peran || ''}
                          />
                          <ListInput
                            label="Wilayah"
                            type="text"
                            placeholder="Wilayah"
                            clearButton
                            value={this.state.pengguna.rows[0].wilayah || ''}
                          />
                        </List>
                      }
                    </Tab>
                    <Tab id="tab-3" className="page-content" style={{padding:'0px', overflow:'hidden', borderRadius:'20px'}}>
                      {this.state.set_password === false &&
                        <Card
                          style={{background:'#b71c1c', color:'white'}}
                          content="Anda belum mengatur password  untuk akun Anda. Demi keamanan, silakan atur password terlebih dahulu"
                        />
                      }
                      <List noHairlinesMd style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                        {JSON.parse(localStorage.getItem('user')).password !== null &&
                        <ListInput
                          label="Password Lama"
                          type="password"
                          placeholder="Password Lama..."
                          clearButton
                          onChange={this.setValue('password_lama')}
                        />
                        }
                        <ListInput
                          label="Password Baru"
                          type="password"
                          placeholder="Password Baru..."
                          clearButton
                          onChange={this.setValue('password')}
                        />
                        <ListInput
                          label="Ulangi Password Baru"
                          type="password"
                          placeholder="Ulangi Password Baru..."
                          clearButton
                          onChange={this.setValue('password_ulang')}
                        />
                      </List>    
                    </Tab>
                    <Tab id="tab-4" className="page-content" style={{padding:'0px', overflow:'hidden'}}>
                      <Row noGap>
                        {parseInt(this.state.pengguna.rows[0].verified) === 1 &&
                          <Col width={100}>
                            <Card style={{background:'#7DB53F', color:'white'}}>
                              <CardContent>
                                <i className="f7-icons" style={{fontSize:'60px', color:'white'}}>checkmark_shield</i>
                                <h4>Akun Anda telah terverifikasi!</h4>
                              </CardContent>
                            </Card>
                          </Col>
                        }
                        {parseInt(this.state.pengguna.rows[0].verified) === 10 &&
                          <Col width={100}>
                            <Card
                              style={{background:'#B9A43F', color:'white'}}
                              content="Terima kasih telah mengupload berkas verifikasi! Silakan menunggu hingga Administrator memverifikasi akun Anda"
                            />
                          </Col>
                        }
                        {parseInt(this.state.pengguna.rows[0].verified) === 0 &&
                          <>
                            <Col width={100} tabletWidth={50}>
                              <BlockTitle>Upload Gambar KTP</BlockTitle>
                              <Card>
                                <Dropzone className="droping" onDrop={this.acceptedFile}>
                                  {({getRootProps, getInputProps}) => (
                                    <section>
                                      <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_ktp !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                        <input {...getInputProps()} />
                                        {this.state.file_gambar_ktp === '' &&
                                          <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                        }
                                        {this.state.file_gambar_ktp !== '' &&
                                          <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_ktp} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                        {this.state.gambar_ktp === '' &&
                                          <>
                                            <p>Tarik dan seret gambar KTP Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                        {this.state.gambar_ktp !== '' && this.state.file_gambar_ktp === '' &&
                                          <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_ktp}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </Card>
                            </Col>
                            <Col width={100} tabletWidth={50}>
                              <BlockTitle>Upload Gambar SK Pengangkatan</BlockTitle>
                              <Card>
                                <Dropzone className="droping" onDrop={this.acceptedFileSk}>
                                  {({getRootProps, getInputProps}) => (
                                    <section>
                                      <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_ktp !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                        <input {...getInputProps()} />
                                        {this.state.file_gambar_sk === '' &&
                                          <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                        }
                                        {this.state.file_gambar_sk !== '' &&
                                          <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_sk} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                        {this.state.gambar_sk === '' &&
                                          <>
                                            <p>Tarik dan seret gambar KTP Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                        {this.state.gambar_sk !== '' && this.state.file_gambar_sk === '' &&
                                          <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_sk}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                          </>
                                        }
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </Card>
                            </Col>
                          </>
                        }
                      </Row>
                    </Tab>
                  </Tabs>
                  {!this.$f7route.params['pengguna_id'] && 
                    <Button style={{marginBottom:'8px', marginTop:'8px', display:'inline-flex'}} disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                  }
                </Col>
              </Row>
            </Block>
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
    getWilayah: Actions.getWilayah,
    getPengguna: Actions.getPengguna,
    setPengguna: Actions.setPengguna,
    getWilayah: Actions.getWilayah,
    getProvinsi: Actions.getProvinsi,
    getKabupaten: Actions.getKabupaten,
    getKecamatan: Actions.getKecamatan,
  }, dispatch);
}

function mapStateToProps({ App }) {
  return {
    window_dimension: App.window_dimension,
    loading: App.loading,
    tabBar: App.tabBar,
    wilayah: App.wilayah,
    dummy_rows: App.dummy_rows,
    pengguna: App.pengguna,
    wilayah: App.wilayah,
    provinsi: App.provinsi,
    kabupaten: App.kabupaten,
    kecamatan: App.kecamatan,
  }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProfilPengguna));
