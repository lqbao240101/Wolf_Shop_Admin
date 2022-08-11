let Dia_chi_Img='http://localhost:8080';

var capNhat = true;
const Xuat_Danh_sach = (ds) => {
    
    let html = ``;
    ds.sort((a, b) => a.Ten.localeCompare(b.Ten))
    ds.forEach((item, index) => {
        html += `
        <tr>
            <td scope="row" class="text-center">${item.Ma_so}</td>
            <td class="text-center">
                <img src='${Dia_chi_Img}/${item.Ma_so}.png' class="" />
            </td>
            <td>${item.Ten}</td>
            <td class="text-right" >${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Nhap)}<sup>đ</sup></td>
            <td class="text-right">${Tao_Chuoi_The_hien_So_nguyen_duong(item.Don_gia_Ban)}<sup>đ</sup></td>
            <td class="text-center">${item.Nhom_Mat_hang.Ma_so}</td>
            <td>
                <a href="javaScript:void(0)" data-toggle="modal" data-target="#modelId" title='Sửa mặt hàng' onclick="updateMathang('${item.Ma_so}')">
                    <i class="fa fa-pencil-square-o text-danger" aria-hidden="true"></i>
                </a>
            </td>
            <td>
                <a href="javaScript:void(0)" onclick="deleteMathang('${item.Ma_so}')" title='Xóa mặt hàng'>
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
        let ds = dsMathang.filter(x => x.Ten.toLowerCase().includes(gtTim.toLowerCase()))
        Xuat_Danh_sach(ds)

    }
}
// Add Mathang
const insertMathang = () => {
    capNhat = true;
    showModal();
}
// Update Mathang
const updateMathang = (key) => {
    capNhat = false;
    let item = dsMathang.find(x => x.Ma_so == key);
    showModal(item);

}
// Delete Mathang
const deleteMathang = (key) => {
    if(confirm('Hệ thống sẽ xóa Dữ liệu...?')){
        let condition={
            "Ma_so":key
        }
        apiMathangDelete(condition).then(result=>{
            alert('Xóa thành công');
            window.location.reload();
        })
    }
}
// Show Modal
const showModal = (item = null) => {
    let urlImg = null;
    let Nhom = "";
    document.querySelector("#ModalTitle").innerHTML = `Thêm mặt hàng`;
    if (item) {
        document.querySelector("#ModalTitle").innerHTML = `Sửa mặt hàng`;
        urlImg = `${Dia_chi_Img}/${item.Ma_so}.png`;
        Nhom = item.Nhom_Mat_hang.Ma_so;
    }

    let html = ``
    html += `
    <div class="form-group">
        <input type="text" class="form-control" id="Th_Ma_so" style="visibility: hidden;"
            value="${item ? item.Ma_so : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Ten">Tên</label>
        <input type="text" class="form-control" id="Th_Ten" 
            placeholder="Tên Sản phẩm" value="${item ? item.Ten : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Don_gia_Nhap">Đơn giá Nhập</label>
        <input type="number" class="form-control" id="Th_Don_gia_Nhap" 
            placeholder="Đơn giá Nhập" value="${item ? item.Don_gia_Nhap : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Don_gia_Ban">Đơn giá Bán</label>
        <input type="number" class="form-control" id="Th_Don_gia_Ban" 
            placeholder="Đơn giá Bán" value="${item ? item.Don_gia_Ban : ''}">
    </div>
    <div class="form-group">
        <label for="Th_Nhom_Mat_hang">Nhóm mặt hàng</label>
        <select id="Th_Nhom_Mat_hang">
            <option value="CA_PHE" ${Nhom == 'CA_PHE' ? 'selected' : ''} >CA_PHE</option>
            <option value="MON_AN" ${Nhom == 'MON_AN' ? 'selected' : ''}>MON_AN</option>
        </select>
    </div>
    <div class="form-group">
        <label for="Th_File">Chọn hình</label>
        <input type="file" class="form-control-file" id="Th_File" onchange="previewImg()">`
    if (!item) {
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
    let keyNhom = Th_Nhom_Mat_hang.value;
    let arrNhom = dsMathang.filter(x => x.Nhom_Mat_hang.Ma_so == keyNhom)
    arrNhom.sort((a, b) => { return Number(a.Ma_so.trim().split("_")[1]) - Number(b.Ma_so.trim().split("_")[1]) })
    let keyEnd = arrNhom[arrNhom.length - 1];
    let num = Number(keyEnd.Ma_so.split("_")[1]) + 1;
    keyNhom = keyNhom.concat("_", num.toString());
    return keyNhom;
}

// Save 
const saveMathang = () => {

    let Ma_so = (document.querySelector("#Th_Ma_so").value != "") ? document.querySelector("#Th_Ma_so").value : autoKey();
    // console.log(Ma_so);
    // return false;
    let Ten = document.querySelector("#Th_Ten").value.trim();
    let Don_gia_Nhap = Number(document.querySelector("#Th_Don_gia_Nhap").value);
    let Don_gia_Ban = Number(document.querySelector("#Th_Don_gia_Ban").value);
    let Nhom_Mat_hang = document.querySelector("#Th_Nhom_Mat_hang").value;

    if (capNhat) {
        // Insert
        let MathangNew = {
            "Ten": Ten,
            "Ma_so": Ma_so,
            "Don_gia_Ban": Don_gia_Ban,
            "Don_gia_Nhap": Don_gia_Nhap,
            "Nhom_Mat_hang": {
                "Ten": Nhom_Mat_hang,
                "Ma_so": Nhom_Mat_hang
            },
            "Danh_sach_Phieu_Dat": [],
            "Danh_sach_Phieu_Ban": []
        }

        // Call API
        apiMathangInsert(MathangNew).then(result=>{
            console.log(result);
            saveImg(Ma_so);
            apiMathang().then(result => {
                dsMathang = result;
                Xuat_Danh_sach(dsMathang);
                document.querySelector("#ModalCancel").click();
            })
        })


    } else {
        // Update
        let MathangUpdate = {
            condition: {
                "Ma_so": Ma_so
            },
            update: {
                $set: {
                    "Ten": Ten,
                    "Don_gia_Ban": Don_gia_Ban,
                    "Don_gia_Nhap": Don_gia_Nhap,
                    "Nhom_Mat_hang": {
                        "Ten": Nhom_Mat_hang,
                        "Ma_so": Nhom_Mat_hang
                    }
                }

            }
        }

        // Call API
        apiMathangUpdate(MathangUpdate).then(result=>{
            //console.log(result);
            saveImg(Ma_so);
            apiMathang().then(result => {
                dsMathang = result;
                Xuat_Danh_sach(dsMathang);
                document.querySelector("#ModalCancel").click();
            })
            //window.location.reload();
        }) 
    }
}

const saveImg=(Ma_so)=>{
    let imgName = document.querySelector("#Th_File").value
    // Người dùng có chọn hình
    if (imgName) {
        let reader = new FileReader()
        let Chuoi_nhi_phan = ""
        let Ten_Hinh = `${Ma_so}.png` // upload vào thư mục images trong dịch vụ nodejs
        //let Ten_Hinh = `${Ma_so}` // upload lên trên host cloudinary
        reader.onload = function (e) {
            Chuoi_nhi_phan = e.target.result;
            let img = { "name": Ten_Hinh, "src": Chuoi_nhi_phan }
            //console.log(img)
            apiImage(img).then(result=>{
                //console.log(result)
                reader.clear()
            })
        }
        reader.readAsDataURL(document.querySelector("#Th_File").files[0])
    }
}


