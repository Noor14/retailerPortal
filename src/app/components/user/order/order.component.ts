import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppMasks, AppPattern } from 'src/app/shared/app.mask';
import { loadingConfig } from 'src/app/constant/globalfunction';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { TreeNode } from 'primeng/api/treenode';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderComponent implements OnInit, AfterViewInit {
  public cnicMask = AppMasks.cnic_Mask;
  public mobileMask = AppMasks.mobile_Mask;
  public showSpinner: boolean;
  public spinnerConfig: any;
  public kycList: any[]= [];
  public selectedCompany: string= undefined;
  public companyDetailForm: FormGroup;

  files :TreeNode[]=	[
    {
      "data": {
        "name": "Applications",
        "size": "200mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "Angular",
            "size": "25mb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "angular.app",
                "size": "10mb",
                "type": "Application"
              }
            },
            {
              "data": {
                "name": "cli.app",
                "size": "10mb",
                "type": "Application"
              }
            },
            {
              "data": {
                "name": "mobile.app",
                "size": "5mb",
                "type": "Application"
              }
            }
          ]
        },
        {
          "data": {
            "name": "editor.app",
            "size": "25mb",
            "type": "Application"
          }
        },
        {
          "data": {
            "name": "settings.app",
            "size": "50mb",
            "type": "Application"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Cloud",
        "size": "20mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "backup-1.zip",
            "size": "10mb",
            "type": "Zip"
          }
        },
        {
          "data": {
            "name": "backup-2.zip",
            "size": "10mb",
            "type": "Zip"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Desktop",
        "size": "150kb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "note-meeting.txt",
            "size": "50kb",
            "type": "Text"
          }
        },
        {
          "data": {
            "name": "note-todo.txt",
            "size": "100kb",
            "type": "Text"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Documents",
        "size": "75kb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "Work",
            "size": "55kb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "Expenses.doc",
                "size": "30kb",
                "type": "Document"
              }
            },
            {
              "data": {
                "name": "Resume.doc",
                "size": "25kb",
                "type": "Resume"
              }
            }
          ]
        },
        {
          "data": {
            "name": "Home",
            "size": "20kb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "Invoices",
                "size": "20kb",
                "type": "Text"
              }
            }
          ]
        }
      ]
    },
    {
      "data": {
        "name": "Downloads",
        "size": "25mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "Spanish",
            "size": "10mb",
            "type": "Folder"
          },
          "children": [
            {
              "data": {
                "name": "tutorial-a1.txt",
                "size": "5mb",
                "type": "Text"
              }
            },
            {
              "data": {
                "name": "tutorial-a2.txt",
                "size": "5mb",
                "type": "Text"
              }
            }
          ]
        },
        {
          "data": {
            "name": "Travel",
            "size": "15mb",
            "type": "Text"
          },
          "children": [
            {
              "data": {
                "name": "Hotel.pdf",
                "size": "10mb",
                "type": "PDF"
              }
            },
            {
              "data": {
                "name": "Flight.pdf",
                "size": "5mb",
                "type": "PDF"
              }
            }
          ]
        }
      ]
    },
    {
      "data": {
        "name": "Main",
        "size": "50mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "bin",
            "size": "50kb",
            "type": "Link"
          }
        },
        {
          "data": {
            "name": "etc",
            "size": "100kb",
            "type": "Link"
          }
        },
        {
          "data": {
            "name": "var",
            "size": "100kb",
            "type": "Link"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Other",
        "size": "5mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "todo.txt",
            "size": "3mb",
            "type": "Text"
          }
        },
        {
          "data": {
            "name": "logo.png",
            "size": "2mb",
            "type": "Picture"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Pictures",
        "size": "150kb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "barcelona.jpg",
            "size": "90kb",
            "type": "Picture"
          }
        },
        {
          "data": {
            "name": "primeng.png",
            "size": "30kb",
            "type": "Picture"
          }
        },
        {
          "data": {
            "name": "prime.jpg",
            "size": "30kb",
            "type": "Picture"
          }
        }
      ]
    },
    {
      "data": {
        "name": "Videos",
        "size": "1500mb",
        "type": "Folder"
      },
      "children": [
        {
          "data": {
            "name": "primefaces.mkv",
            "size": "1000mb",
            "type": "Video"
          }
        },
        {
          "data": {
            "name": "intro.avi",
            "size": "500mb",
            "type": "Video"
          }
        }
      ]
    }
  ]
  constructor(private _orderDetailService : OrderDetailService) { }

  ngOnInit() {
    this.spinnerConfig = loadingConfig;
    let userObject = JSON.parse(localStorage.getItem('userIdentity')).UserAccount;
    this.getKYCList(userObject.RetailerID);
    this.companyDetailForm = new FormGroup({
      Email: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.email_Pattern)]),
      Mobile: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.mobile_Pattern)]),
      CNIC: new FormControl(null, [Validators.required, Validators.pattern(AppPattern.cnic_Pattern)]),
      CompanyName: new FormControl(null, [Validators.required]),
      CompanyNTN: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required]),
    });
  

  }
  ngAfterViewInit(){
    let elemWrapper = document.getElementsByClassName('ui-treetable-wrapper')[0];
    elemWrapper.classList.add('table-responsive')
    elemWrapper.classList.add('gridArea')
    let elem = document.getElementsByClassName('ui-treetable-table')[0];
    elem.classList.add('table')
  }

  getKYCList(requestId){
    this.showSpinner=true;
    this._orderDetailService.getKYCListDetail('kyc/ConnectedKycList',requestId).then((data: any) => {
      this.kycList = data;
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }
  companyDetail(dealerCode){
    let obj = this.kycList.find(obj=> obj.DealerCode == dealerCode);
    this.companyDetailForm.patchValue(obj);
  }

  companyProducts(dealerCode){
    this.showSpinner=true;
    this._orderDetailService.getKYCListDetail('products/GetProductByDealerCode', dealerCode).then((data: any) => {
      console.log(data)
      this.showSpinner=false;
    })
    .catch(err => {
      this.showSpinner=false;
    })
  }

}
