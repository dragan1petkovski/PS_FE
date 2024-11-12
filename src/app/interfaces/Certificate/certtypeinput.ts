export class CertificateTypeInput
{
    static readonly privatekey = `<div class="row mt-3">
                        <div class="col-3 text-end">
                            Uplaod Certificate
                        </div>
                        <div class="col-9">
                            <input type="file" name="certfile" class="form-control" id="uploadcertificatefile">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-3 text-end">
                            Certificate Password
                        </div>
                        <div class="col-9">
                           <input type="password" name="certpass" class="form-control" id="certificatepassword">
                        </div>
                    </div>`
    
    static readonly pemcert = `<div class="row mt-3">
                        <div class="col-3 text-end">
                            Uplaod PEM certificate only
                        </div>
                        <div class="col-9">
                            <input type="file" name="certfile" class="form-control" id="uploadcertificatefile">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-3 text-end">
                            Upload PEM key only
                        </div>
                        <div class="col-9">
                            <input type="file" name="certkey" class="form-control" id="uploadcertificatefile">
                        </div>
                    </div>`
}