<div class="col-md-12">
    {{#each errors}}
                    <div class="error">
                        <div class="alert text-center alert-danger">{{text}}</div>
                    </div>
                    {{/each}}
      <div class="card border-dark mb-3">
        <div class="card-header text-center">
          <b>Informations importantes</b>
        
        <div class="float-right">
            <a class="btn btn-primary" href="/mkroute/add"><i class="fas fa-plus    "></i>Ajouter</a>
        </div>
        </div>
        <div class="card-body">
          <table class="table table-bordered">

            <tbody>
              <tr>
                <th scope="row">Message Ecran Machine</th>
                <td>{{machine_data.screenMessage}}</td>
                <td><a
                     href="/mroute/edit"
                    class="btn btn-info"
                  >Modifier</a></td>

              </tr>
              <tr>
                <th scope="row">Entête ticket</th>
                <td>{{mikrotik_data.ticket_header}}</td>
                <td><a
                    
                    href="/mkroute/edit"
                    class="btn btn-info"
                  >Modifier</a></td>

              </tr>
              <tr>
                <th scope="row">Pied ticket</th>
                <td colspan="2">{{mikrotik_data.ticket_footer}}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div></div>
      
      <!-- Modal -->
      <div class="modal fade" id="mrouteedit" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                      <div class="modal-header">
                              <h5 class="modal-title">Modifier</h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                          </div>
                  <div class="modal-body">
                      <div class="container-fluid">
                          <form action="/mroute/edit" method="post">
                            <div class="form-group">
                            <label for="screenMessage"></label>
                            <input
                                type="message"
                                class="form-control"
                                name="screenMessage"
                                value="{{machine.screenMessage}}"
                                required
                            />
                            </div>
                           
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                       <button type="submit" class="btn btn-primary">Modifier</button>
                        </form>
                  </div>
              </div>
          </div>
      </div>


<!-- Modal -->
<div class="modal fade" id="mkrouteedit" tabindex="-1" role="dialog" aria-labelledby="modelmkrouteedit" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
                <div class="modal-header">
                        <h5 class="modal-title">Modifier</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
            <div class="modal-body">
                <div class="container-fluid">
                    
                    <div class="card card-body">
                    <h3>Modifier les infos du ticket</h3>
                    <form action="/mkroute/edit" method="post">
                        <div class="form-group">
                        <label for="ticket_header">Entête</label>
                        <input
                            type="message"
                            class="form-control"
                            name="ticket_header"
                            value="{{machine_data.ticket_header}}"
                            required
                        />
                        </div>
                        <div class="form-group">
                        <label for="ticket_footer">Pied de page</label>
                        <input
                            type="message"
                            class="form-control"
                            name="ticket_footer"
                            value="{{machine_data.ticket_footer}}"
                            required
                        />
                        </div>
                        <div class="form-group">
                        <label for="mikrotik_address">Addresse mikrotik</label>
                        <input
                            type="message"
                            class="form-control"
                            name="mikrotik_address"
                            value="{{machine_data.mikrotik_address}}"
                            required
                        />
                        </div>
                        <div class="form-group">
                        <label for="printer_address">Addresse printer</label>
                        <input
                            type="message"
                            class="form-control"
                            name="printer_address"
                            value="{{machine_data.printer_address}}"
                            required
                        />
                        </div>
                      
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                 <button type="submit" class="btn btn-primary">Modifier</button>
                    </form>
            </div>
        </div>
    </div>
</div>

<script>
    $('#exampleModal').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        var modal = $(this);
        // Use above variables to manipulate the DOM
        
    });
</script>