import { loadingConfig } from './../../../constant/globalfunction';
import { PaymentService } from './../../../components/user/payment/payment.service';
import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  @Input() obj:any;
  public paymentInstructions: any;
  public spinnerConfig:any;
  public showSpinner:boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private _paymentService: PaymentService,
    private _domSanitizer: DomSanitizer,
    private _toast: ToastrService,

  ) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    if(this.obj && Object.keys(this.obj).length){
      this.paymentInstructions = this.obj;
    }
  }
  viewVoucher(){
    this.showSpinner=true;
    this._paymentService.getVoucher(this.paymentInstructions.endPoint, this.paymentInstructions.VoucherNo)
    .then((res:any)=>{
      this.showSpinner=false;
      if(res.data && res.data.length){
        let typedArray = new Uint8Array(res.data);
        const stringChar = typedArray.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '')
        let base64String = btoa(stringChar);
        let doc = this._domSanitizer.bypassSecurityTrustUrl(`data:application/octet-stream;base64, ${base64String}`) as string;
        doc = this._domSanitizer.sanitize(SecurityContext.URL, doc) ;
        const downloadLink = document.createElement("a");
        const fileName = "voucher.pdf";
        downloadLink.href = doc;
        downloadLink.download = fileName;
        downloadLink.click();
      }

    })
    .catch(err=>{
      this.showSpinner=false;
        if(err.error){
          this._toast.error(err.error.message, "Error")
        }
      })
  }

}
