var danhSachSinhVien = new DanhSachSinhVien();
var validate = new Validation();

// Bổ sung thuộc tính
SinhVien.prototype.DiemToan = '';
SinhVien.prototype.DiemLy = '';
SinhVien.prototype.DiemHoa = '';
SinhVien.prototype.DTB = '';
SinhVien.prototype.Loai = '';

// Bổ sung phương thức
SinhVien.prototype.TinhDTB = function () {
  this.DTB =
    (Number(this.DiemHoa) + Number(this.DiemLy) + Number(this.DiemHoa)) / 3;
};

SinhVien.prototype.XepLoai = function () {
  if (this.DTB <= 10 && this.DTB >= 8) {
    this.Loai = 'Xếp Loại Giỏi';
  } else if (this.DTB < 8 && this.DTB > 6.5) {
    this.Loai = 'Xếp Loại Khá';
  } else if (this.DTB < 6.5 && this.DTB > 5) {
    this.Loai = 'Xếp Loại Trung Bình';
  } else {
    this.Loai = 'Xếp Loại Yếu';
  }
};

function DomID(id) {
  var element = document.getElementById(id);
  return element;
}

function ThemSinhVien() {
  // Lấy dữ liệu từ người dùng nhập vào
  var masv = DomID('masv').value;
  var hoten = DomID('hoten').value;
  var cmnd = DomID('cmnd').value;
  var email = DomID('email').value;
  var sdt = DomID('sdt').value;
  // Kiểm tra validation
  var loi = 0;
  if (KiemTraDauVaoRong('masv', masv) == true) {
    loi++;
  }
  if (KiemTraDauVaoRong('hoten', hoten) == true) {
    loi++;
  }
  if (KiemTraDauVaoRong('cmnd', cmnd) == true) {
    loi++;
  }

  if (validate.KiemTraEmail(email)) {
    DomID('email').style.borderColor = 'green';
  } else {
    DomID('email').style.borderColor = 'red';
    loi++;
  }

  if (validate.KiemTraSoDT(sdt)) {
    DomID('sdt').style.borderColor = 'green';
  } else {
    DomID('sdt').style.borderColor = 'red';
    loi++;
  }

  if (loi != 0) {
    return false;
  }

  // thêm sinh viên
  var sinhvien = new SinhVien(masv, hoten, email, sdt, cmnd);
  sinhvien.DiemToan = DomID('Toan').value;
  sinhvien.DiemLy = DomID('Ly').value;
  sinhvien.DiemHoa = DomID('Hoa').value;
  sinhvien.TinhDTB();
  sinhvien.XepLoai();
  danhSachSinhVien.ThemSinhVien(sinhvien);
  CapNhatDanhSachSinhVien(danhSachSinhVien);
  console.log(danhSachSinhVien);
}

function KiemTraDauVaoRong(ID, value) {
  // Kiểm tra mã SV rỗng
  if (validate.KiemTraRong(value) == true) {
    DomID(ID).style.borderColor = 'red';
    return true;
  } else {
    DomID(ID).style.borderColor = 'green';
    return false;
  }
}

function CapNhatDanhSachSinhVien(DanhSachSinhVien) {
  var lstTableSV = DomID('tbodySinhVien');
  lstTableSV.innerHTML = '';
  for (var i = 0; i < DanhSachSinhVien.DSSV.length; i++) {
    // Lấy thông tin sinh viên từ mảng sinh viên
    var sv = DanhSachSinhVien.DSSV[i];

    // Tạo thẻ tr
    var trSinhVien = document.createElement('tr');
    trSinhVien.id = sv.MaSV;
    trSinhVien.className = 'trSinhVien';
    trSinhVien.setAttribute('onclick', 'ChinhSuaSinhVien("' + sv.MaSV + '")'); // nhớ thêm cặp dấu nháy bên ngoài +sv.MaSV để nó hiểu là chuỗi
    // Tạo các thẻ td và filter dữ liệu sinh viên thứ [i] vào
    var tdCheckBox = document.createElement('td');
    var ckbMaSinhVien = document.createElement('input');
    ckbMaSinhVien.setAttribute('class', 'ckbMaSV');
    ckbMaSinhVien.setAttribute('type', 'checkbox');
    ckbMaSinhVien.setAttribute('value', sv.MaSV);
    tdCheckBox.appendChild(ckbMaSinhVien);

    var tdMaSV = TaoTheTD('MaSV', sv.MaSV);
    var tdHoTen = TaoTheTD('HoTen', sv.HoTen);
    var tdCMND = TaoTheTD('CMND', sv.CMND);
    var tdEmail = TaoTheTD('Email', sv.Email);
    var tdSoDT = TaoTheTD('SoDT', sv.SoDT);

    //Tạo td DTB và Xếp loại
    var tdDTB = TaoTheTD('DTB', sv.DTB);
    var tdXepLoai = TaoTheTD('XepLoai', sv.Loai);

    // Append td vào tr
    trSinhVien.appendChild(tdCheckBox);
    trSinhVien.appendChild(tdMaSV);
    trSinhVien.appendChild(tdHoTen);
    trSinhVien.appendChild(tdEmail);
    trSinhVien.appendChild(tdCMND);
    trSinhVien.appendChild(tdSoDT);
    trSinhVien.appendChild(tdDTB);
    trSinhVien.appendChild(tdXepLoai);

    // Append tr vào tbody
    lstTableSV.appendChild(trSinhVien);
  }
}

function TaoTheTD(className, value) {
  var td = document.createElement('td');
  td.className = className;
  td.innerHTML = value;
  return td;
}

function SetStorage() {
  // chuyển đổi object mảng danh sách sinh viên thành chuỗi json
  var jsonDanhSachSinhVien = JSON.stringify(danhSachSinhVien.DSSV);
  // Rồi đem chuỗi json lưu vào storage và đặt tên là DanhSachSV
  localStorage.setItem('DanhSachSV', jsonDanhSachSinhVien);
}
function GetStorage() {
  // lấy ra chuỗi json là mảng danhsachsinhvien thông qua tên
  var jsonDanhSachSinhVien = localStorage.getItem('DanhSachSV');
  var mangDSSV = JSON.parse(jsonDanhSachSinhVien);
  danhSachSinhVien.DSSV = mangDSSV;
  CapNhatDanhSachSinhVien(danhSachSinhVien);
}

// Xóa sinh viên
function XoaSinhVien() {
  var lstMaSV = document.getElementsByClassName('ckbMaSV');
  var lstMaSVDuocChon = [];
  for (var i = 0; i < lstMaSV.length; i++) {
    if (lstMaSV[i].checked) {
      lstMaSVDuocChon.push(lstMaSV[i].value);
    }
  }
  danhSachSinhVien.XoaSinhVien(lstMaSVDuocChon);
  CapNhatDanhSachSinhVien(danhSachSinhVien);
}

function TimKiemSinhVien() {
  var tukhoa = DomID('tukhoa').value;
  var lstDanhSachTimKiem = danhSachSinhVien.TimKiemSinhVien(tukhoa);
  CapNhatDanhSachSinhVien(lstDanhSachTimKiem);
}

function ChinhSuaSinhVien(masv) {
  var sinhvien = danhSachSinhVien.TimSVTheoMa(masv);
  if (sinhvien != null) {
    DomID('masv').value = sinhvien.MaSV;
    DomID('hoten').value = sinhvien.HoTen;
    DomID('cmnd').value = sinhvien.CMND;
    DomID('email').value = sinhvien.Email;
    DomID('sdt').value = sinhvien.SoDT;
  }
}

function LuuThongTin() {
  // Lấy dữ liệu từ người dùng nhập vào
  var masv = DomID('masv').value;
  var hoten = DomID('hoten').value;
  var cmnd = DomID('cmnd').value;
  var email = DomID('email').value;
  var sdt = DomID('sdt').value;
  // Kiểm tra validation
  var loi = 0;
  if (KiemTraDauVaoRong('masv', masv) == true) {
    loi++;
  }
  if (KiemTraDauVaoRong('hoten', hoten) == true) {
    loi++;
  }
  if (KiemTraDauVaoRong('cmnd', cmnd) == true) {
    loi++;
  }

  if (validate.KiemTraEmail(email)) {
    DomID('email').style.borderColor = 'green';
  } else {
    DomID('email').style.borderColor = 'red';
    loi++;
  }

  if (validate.KiemTraSoDT(sdt)) {
    DomID('sdt').style.borderColor = 'green';
  } else {
    DomID('sdt').style.borderColor = 'red';
    loi++;
  }

  if (loi != 0) {
    return false;
  }

  // Sửa sinh viên
  var sinhvien = new SinhVien(masv, hoten, email, sdt, cmnd);
  sinhvien.DiemToan = DomID('Toan').value;
  sinhvien.DiemLy = DomID('Ly').value;
  sinhvien.DiemHoa = DomID('Hoa').value;
  sinhvien.TinhDTB();
  sinhvien.XepLoai();
  danhSachSinhVien.SuaSinhVien(sinhvien);
  CapNhatDanhSachSinhVien(danhSachSinhVien);
  console.log(danhSachSinhVien);
}
