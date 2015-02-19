'use strict';
app.controller('accountSettingsCtrl',
    function ($scope) {
        $scope.updateAccountForm = function () {
            if (CarglyPartner.accountInfo) {
                $scope.user = {
                    businessName: CarglyPartner.accountInfo["businessName"],
                    website: CarglyPartner.accountInfo["website"],
                    address: CarglyPartner.accountInfo["address"],
                    city: CarglyPartner.accountInfo["city"],
                    state: CarglyPartner.accountInfo["state"],
                    zip: CarglyPartner.accountInfo["zip"],
                    timezone: CarglyPartner.accountInfo["timezone"],
                    contactName: CarglyPartner.accountInfo["contactName"],
                    paymentProcessingSecretKey: CarglyPartner.accountInfo["paymentProcessingSecretKey"],
                    paymentProcessingPublicKey: CarglyPartner.accountInfo["paymentProcessingPublicKey"],
                    paymentProcessingAccountId: CarglyPartner.accountInfo["paymentProcessingAccountId"]
                };
                $scope.cardType = CarglyPartner.accountInfo["cardType"];
                $scope.cardLast4 = CarglyPartner.accountInfo["cardLast4"];
                $scope.email = CarglyPartner.accountInfo["email"],
                    $scope.$apply();
            }
        };

        $scope.fetchAccount = function () {
            console.log(CarglyPartner.user);
            CarglyPartner.ajax({
                url: '/partners/api/account/' + CarglyPartner.user.id,
                type: 'GET',
                success: function (data) {
                    CarglyPartner.accountInfo = data;
                    $scope.updateAccountForm();
                }
            });
            return false;
        };

        setTimeout(function(){
            $scope.fetchAccount();
        },1000);


        $scope.cancel = function(){
            $scope.fetchAccount();
        }

        $scope.updateUser = function () {
          var id = CarglyPartner.user.id;
          if (id.length == 0) id = null;
          CarglyPartner.ajax({
            url: '/partners/api/account' + (id ? "/" + id : "" ),
            type: 'POST',
            data: $scope.user,
            success: function (data) {
              $scope.fetchAccount();
            }
          });
        };
    });
