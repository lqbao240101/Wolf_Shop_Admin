let Dia_chi_Img = 'http://localhost:8080';

var userCheck = JSON.parse(sessionStorage.getItem("USER"));
var capNhat = true;
const Xuat_Danh_sach = (ds) => {

    let html = ``;
    ds.sort((a, b) => a.Ten.localeCompare(b.Ten))
    ds.forEach((admin, index) => {
        html += `
        <tr>
            <td scope="row" class="text-center">${admin.Ma_so}</td>
            <td class="text-center">
                <img src='${Dia_chi_Img}/${admin.Ma_so}.png' class="" />
            </td>
            <td>${admin.Ten}</td>
            <td class="text-right" >${admin.Ten_Dang_nhap}</td>
            <td class="text-center">${admin.Nhom.Ma_so}</td>
            <td>
                <a href="javaScript:void(0)" data-toggle="modal" ${userCheck.Ma_so == admin.Ma_so ? 'data-target="#modelId"' : ''} title='Sửa Admin' onclick="updateAdmin('${admin.Ma_so}')">
                    <i class="fa fa-pencil-square-o text-danger" aria-hidden="true"></i>
                </a>
            </td>
            <td>
                <a href="javaScript:void(0)" onclick="deleteAdmin('${admin.Ma_so}')" title='Xóa Admin'>
                    <i class="fa fa-trash text-danger" aria-hidden="true"></i>
                </a>
            </td>
        </tr>
        `
    })

    document.querySelector("#Th_Danhsach").innerHTML = html;
}

const KeyCode = (event) => {
    if (event.keyCode == 13) {
        let gtTim = event.target.value.trim()
        let ds = dsAdmin.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()))
        Xuat_Danh_sach(ds)
    }
}
// Add Admin
const insertAdmin = () => {
    if (userCheck.Nhom.Ma_so == "QUAN_LY") {
        capNhat = true;
        showModal();
    } else {
        alert("Bạn không có đủ quyền hạn để làm điều này!");
        return false;
    }
}
// Update Admin
const updateAdmin = (key) => {
    capNhat = false;
    let admin = dsAdmin.find(x => x.Ma_so == key);
    if (userCheck.Ma_so == admin.Ma_so) {
        showModal(admin);
    } else {
        alert("Bạn không có đủ quyền hạn để làm điều này!");
        return false;
    }
}
// Delete Admin
const deleteAdmin = (key) => {
    if (userCheck.Nhom.Ma_so == "QUAN_LY") {
        if (confirm('Hệ thống sẽ xóa Dữ liệu...?')) {
            let condition = {
                "Ma_so": key
            }
            apiAdminDelete(condition).then(result => {
                alert('Xóa thành công');
                window.location.reload();
            })
        }
    } else {
        alert("Bạn không có đủ quyền hạn để làm điều này!");
        return false;
    }
}
// Show Modal
const showModal = (admin = null) => {
    let urlImg = null;
    let Nhom = "";
    document.querySelector("#ModalTitle").innerHTML = `Thêm Admin`;
    if (admin) {
        document.querySelector("#ModalTitle").innerHTML = `Sửa Admin`;
        urlImg = `${Dia_chi_Img}/${admin.Ma_so}.png`;
        Nhom = admin.Nhom.Ma_so;
    }

    let html = ``
    html += `
    <div class="form-group">
        <input type="text" class="form-control" id="Th_Ma_so" style="visibility: hidden;"
            value="${admin ? admin.Ma_so : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Ten">Tên Admin</label>
        <input type="text" class="form-control" id="Th_Ten" 
            placeholder="Tên Admin" value="${admin ? admin.Ten : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Ten_Dang_nhap">Tên đăng nhập</label>
        <input type="text" class="form-control" id="Th_Ten_Dang_nhap" 
            placeholder="Tên đăng nhập" value="${admin ? admin.Ten_Dang_nhap : ''}">
    </div>`;

    if (admin != null) {
        html += `
        <div class="form-group">
            <label for="Th_Mat_khau_cu">Mật khẩu cũ</label>
            <input type="password" class="form-control" id="Th_Mat_khau_cu"
                placeholder="Mật khẩu" value="">
        </div>`;
    }

    html += `
    <div class="form-group">
        <label for="Th_Mat_khau">${admin ? 'Mật khẩu mới' : 'Mật khẩu'}</label>
        <input type="password" class="form-control" id="Th_Mat_khau" 
            placeholder="Mật khẩu" value="">
    </div>

    <div class="form-group">
    <label for="Th_Mat_khau_2">${admin ? 'Xác nhận mật khẩu mới' : 'Xác nhận mật khẩu'}</label>
    <input type="password" class="form-control" id="Th_Mat_khau_2" 
        placeholder="Xác nhận mật khẩu" value="">
    </div>

    <div class="form-group">
        <label for="Th_Nhom_Admin">Nhóm Admin</label>
        <select id="Th_Nhom_Admin">
            <option value="GIAO_HANG" ${Nhom == 'GIAO_HANG' ? 'selected' : ''} >GIAO_HANG</option>
            <option value="NHAP_HANG" ${Nhom == 'NHAP_HANG' ? 'selected' : ''}>NHAP_HANG</option>
            <option value="BAN_HANG" ${Nhom == 'BAN_HANG' ? 'selected' : ''}>BAN_HANG</option>
            <option value="QUAN_LY" ${Nhom == 'QUAN_LY' ? 'selected' : ''} >QUAN_LY</option>
        </select>
    </div>
    <div class="form-group">
        <label for="Th_File">Chọn hình</label>
        <input type="file" class="form-control-file" id="Th_File" onchange="previewImg()">`
    if (!admin) {
        html += `<img id="Th_PreImg" style="width:10rem"  />`
    } else {
        html += `<img id="Th_PreImg" style="width:10rem" src="${urlImg}"  />`
    }

    html += `</div>`
    document.querySelector("#ModalBody").innerHTML = html

}
// Preview Image
const previewImg = () => {
    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(e.target.result)
        Th_PreImg.src = e.target.result;
    }
    reader.readAsDataURL(document.querySelector("#Th_File").files[0]);

}
// Get key end, create key new
const autoKey = () => {
    let keyNhom = Th_Nhom_Admin.value;
    let Ma;
    if (keyNhom == "QUAN_LY") {
        Ma = "QL";
    } else {
        Ma = "NV";
    }
    let arrNhom = dsAdmin.filter(x => x.Nhom.Ma_so == keyNhom)
    arrNhom.sort((a, b) => { return Number(a.Ma_so.trim().split("_")[1]) - Number(b.Ma_so.trim().split("_")[1]) })
    let keyEnd = arrNhom[arrNhom.length - 1];
    let num = Number(keyEnd.Ma_so.split("_")[1]) + 1;
    Ma = Ma.concat("_", num.toString());
    return Ma;
}

// Save 
const saveAdmin = () => {
    let Ma_so = (document.querySelector("#Th_Ma_so").value != "") ? document.querySelector("#Th_Ma_so").value : autoKey();
    let Ten = document.querySelector("#Th_Ten").value.trim();
    let Ten_Dang_nhap = document.querySelector("#Th_Ten_Dang_nhap").value;
    let Mat_khau = document.querySelector("#Th_Mat_khau").value;
    let Mat_khau_2 = document.querySelector("#Th_Mat_khau_2").value;
    let Nhom_Admin = document.querySelector("#Th_Nhom_Admin").value;
    let Nhom_Ten;

    if (Nhom_Admin == "QUAN_LY") {
        Nhom_Ten = "Quản lý";
    } else if (Nhom_Admin == "GIAO_HANG") {
        Nhom_Ten == "Nhân viên giao hàng";
    } else if (Nhom_Admin == "BAN_HANG") {
        Nhom_Ten == "Nhân viên bán hàng";
    } else if (Nhom_Admin == "NHAP_HANG") {
        Nhom_Ten == "Nhân viên nhập hàng";
    }

    if (Mat_khau != Mat_khau_2) {
        alert("Mật khẩu và xác nhận mật khẩu phải giống nhau!");
        return false;
    }

    if (capNhat) {
        dsAdmin.forEach(admin => {
            if (admin.Ten_Dang_nhap == Ten_Dang_nhap) {
                alert("Tên đăng nhập bị trùng!");
                return false;
            }
        })
        // Insert
        let AdminNew = {
            "Ten": Ten,
            "Ma_so": Ma_so,
            "Ten_Dang_nhap": Ten_Dang_nhap,
            "Mat_khau": Mat_khau,
            "Nhom": {
                "Ten": Nhom_Ten,
                "Ma_so": Nhom_Admin
            }
        }

        // Call API
        apiAdminInsert(AdminNew).then(result => {
            saveImg(Ma_so);
            apiAdmin().then(result => {
                dsAdmin = result;
                Xuat_Danh_sach(dsAdmin);
                document.querySelector("#ModalCancel").click();
            })
        })

    } else {
        // Update
        let Mat_khau_cu = document.querySelector("#Th_Mat_khau_cu").value;
        let nd = {
            "Ma_so": userCheck.Ma_so,
            "Mat_khau": Mat_khau_cu
        };
        apiCheckPassword(nd).then(result => {
            if (result === "truee") {
                let AdminUpdate = {
                    condition: {
                        "Ma_so": Ma_so
                    },
                    update: {
                        $set: {
                            "Ten": Ten,
                            "Ten_Dang_nhap": Ten_Dang_nhap,
                            "Mat_khau": Mat_khau,
                            "Nhom": {
                                "Ten": Nhom_Ten,
                                "Ma_so": Nhom_Admin
                            }
                        }
                    }
                }

                apiAdminUpdate(AdminUpdate).then(result => {
                    saveImg(Ma_so);
                    apiAdmin().then(result => {
                        dsAdmin = result;
                        Xuat_Danh_sach(dsAdmin);
                        document.querySelector("#ModalCancel").click();
                    })
                    window.location.reload();
                })

            } else {
                alert("Mật khẩu cũ không chính xác!");
            }
        }).catch(err => {
            console.log(err);
        })
    }
}

const saveImg = (Ma_so) => {
    let imgName = document.querySelector("#Th_File").value
    // Người dùng có chọn hình
    if (imgName) {
        let reader = new FileReader()
        let Chuoi_nhi_phan = ""
        let Ten_Hinh = `${Ma_so}.png` // upload vào thư mục images trong dịch vụ nodejs
        reader.onload = function (e) {
            Chuoi_nhi_phan = e.target.result;
            let img = { "name": Ten_Hinh, "src": Chuoi_nhi_phan }
            apiImage(img).then(result => {
                reader.clear()
            })
        }
        reader.readAsDataURL(document.querySelector("#Th_File").files[0])
    }
}