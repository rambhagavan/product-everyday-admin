import React from 'react'
import { ContentBox } from '../../styles/AppStyles'


const Orders = () => {
    return (
        <ContentBox>
          <div class="card mb-3">
            <div class="card-header">
              <div class="row align-items-center justify-content-between">
                <div class="col-4 col-sm-auto d-flex align-items-center pr-0">
                  <h5 class="fs-0 mb-0 text-nowrap py-2 py-xl-0">Orders</h5>
                </div>
                <div class="col-8 col-sm-auto ml-auto text-right pl-0">
                  <div class="d-none" id="orders-actions">
                    <div class="input-group input-group-sm">
                      <select class="custom-select cus" aria-label="Bulk actions">
                        <option selected="">Bulk actions</option>
                        <option value="Refund">Refund</option>
                        <option value="Delete">Delete</option>
                        <option value="Archive">Archive</option>
                      </select>
                      <button class="btn btn-falcon-default btn-sm ml-2" type="button">Apply</button>
                    </div>
                  </div>
                  <div id="dashboard-actions">
                    <button class="btn btn-falcon-default btn-sm" type="button"><span class="fas fa-plus" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ml-1">New</span></button>
                    <button class="btn btn-falcon-default btn-sm mx-2" type="button"><span class="fas fa-filter" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ml-1">Filter</span></button>
                    <button class="btn btn-falcon-default btn-sm" type="button"><span class="fas fa-external-link-alt" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ml-1">Export</span></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="falcon-data-table">
                <table class="table table-sm mb-0 table-striped table-dashboard fs--1 data-table border-bottom border-200" data-options='{"searching":false,"responsive":false,"info":false,"lengthChange":false,"sWrapper":"falcon-data-table-wrapper","dom":"<&#39;row mx-1&#39;<&#39;col-sm-12 col-md-6&#39;l><&#39;col-sm-12 col-md-6&#39;f>><&#39;table-responsive&#39;tr><&#39;row no-gutters px-1 py-3 align-items-center justify-content-center&#39;<&#39;col-auto&#39;p>>","language":{"paginate":{"next":"<span class=\"fas fa-chevron-right\"></span>","previous":"<span class=\"fas fa-chevron-left\"></span>"}}}'>
                  <thead class="bg-200 text-900">
                    <tr>
                      <th class="align-middle no-sort">
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input checkbox-bulk-select" id="checkbox-bulk-purchases-select" type="checkbox" data-checkbox-body="#orders" data-checkbox-actions="#orders-actions" data-checkbox-replaced-element="#dashboard-actions"/>
                          <label class="custom-control-label" for="checkbox-bulk-purchases-select"></label>
                        </div>
                      </th>
                      <th class="align-middle sort">Order</th>
                      <th class="align-middle sort pr-7">Date</th>
                      <th class="align-middle sort" style={{"min-width": "12.5rem"}}>Ship To</th>
                      <th class="align-middle sort text-center">Status</th>
                      <th class="align-middle sort text-right">Amount</th>
                      <th class="no-sort"></th>
                    </tr>
                  </thead>
                  <tbody id="orders">
                    <tr class="btn-reveal-trigger">
                      <td class="py-2 align-middle">
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input checkbox-bulk-select-target" type="checkbox" id="checkbox-0" />
                          <label class="custom-control-label" for="checkbox-0"></label>
                        </div>
                      </td>
                      <td class="py-2 align-middle white-space-nowrap"><a href="../e-commerce/order-details.html"> <strong>#181</strong></a> by <strong>Ricky Antony</strong><br /><a href="mailto:ricky@example.com">ricky@example.com</a></td>
                      <td class="py-2 align-middle">20/04/2019</td>
                      <td class="py-2 align-middle">Ricky Antony, 2392 Main Avenue, Penasauka, New Jersey 02149
                        <p class="mb-0 text-500">Via Flat Rate</p>
                      </td>
                      <td class="py-2 align-middle text-center fs-0 white-space-nowrap"><span class="badge badge rounded-capsule d-block badge-success">Completed<span class="ml-1 fas fa-check" data-fa-transform="shrink-2"></span></span>
                      </td>
                      <td class="py-2 align-middle text-right fs-0 font-weight-medium">$99</td>
                      <td class="py-2 align-middle white-space-nowrap">
                        <div class="dropdown text-sans-serif">
                          <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal mr-3" type="button" id="order-dropdown-0" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--1"></span></button>
                          <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="order-dropdown-0">
                            <div class="bg-white py-2"><a class="dropdown-item" href="#!">Completed</a><a class="dropdown-item" href="#!">Processing</a><a class="dropdown-item" href="#!">On Hold</a><a class="dropdown-item" href="#!">Pending</a>
                              <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Delete</a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="btn-reveal-trigger">
                      <td class="py-2 align-middle">
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input checkbox-bulk-select-target" type="checkbox" id="checkbox-1" />
                          <label class="custom-control-label" for="checkbox-1"></label>
                        </div>
                      </td>
                      <td class="py-2 align-middle white-space-nowrap"><a href="../e-commerce/order-details.html"> <strong>#182</strong></a> by <strong>Kin Rossow</strong><br /><a href="mailto:kin@example.com">kin@example.com</a></td>
                      <td class="py-2 align-middle">20/04/2019</td>
                      <td class="py-2 align-middle">Kin Rossow, 1 Hollywood Blvd,Beverly Hills, California 90210
                        <p class="mb-0 text-500">Via Free Shipping</p>
                      </td>
                      <td class="py-2 align-middle text-center fs-0 white-space-nowrap"><span class="badge badge rounded-capsule d-block badge-primary">Processing<span class="ml-1 fas fa-redo" data-fa-transform="shrink-2"></span></span>
                      </td>
                      <td class="py-2 align-middle text-right fs-0 font-weight-medium">$120</td>
                      <td class="py-2 align-middle white-space-nowrap">
                        <div class="dropdown text-sans-serif">
                          <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal mr-3" type="button" id="order-dropdown-1" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--1"></span></button>
                          <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="order-dropdown-1">
                            <div class="bg-white py-2"><a class="dropdown-item" href="#!">Completed</a><a class="dropdown-item" href="#!">Processing</a><a class="dropdown-item" href="#!">On Hold</a><a class="dropdown-item" href="#!">Pending</a>
                              <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Delete</a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="btn-reveal-trigger">
                      <td class="py-2 align-middle">
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input checkbox-bulk-select-target" type="checkbox" id="checkbox-2" />
                          <label class="custom-control-label" for="checkbox-2"></label>
                        </div>
                      </td>
                      <td class="py-2 align-middle white-space-nowrap"><a href="../e-commerce/order-details.html"> <strong>#183</strong></a> by <strong>Merry Diana</strong><br /><a href="mailto:merry@example.com">merry@example.com</a></td>
                      <td class="py-2 align-middle">30/04/2019</td>
                      <td class="py-2 align-middle">Merry Diana, 1 Infinite Loop, Cupertino, California 90210
                        <p class="mb-0 text-500">Via Link Road</p>
                      </td>
                      <td class="py-2 align-middle text-center fs-0 white-space-nowrap"><span class="badge badge rounded-capsule d-block badge-secondary">On Hold<span class="ml-1 fas fa-ban" data-fa-transform="shrink-2"></span></span>
                      </td>
                      <td class="py-2 align-middle text-right fs-0 font-weight-medium">$70</td>
                      <td class="py-2 align-middle white-space-nowrap">
                        <div class="dropdown text-sans-serif">
                          <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal mr-3" type="button" id="order-dropdown-2" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--1"></span></button>
                          <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="order-dropdown-2">
                            <div class="bg-white py-2"><a class="dropdown-item" href="#!">Completed</a><a class="dropdown-item" href="#!">Processing</a><a class="dropdown-item" href="#!">On Hold</a><a class="dropdown-item" href="#!">Pending</a>
                              <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Delete</a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="btn-reveal-trigger">
                      <td class="py-2 align-middle">
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input checkbox-bulk-select-target" type="checkbox" id="checkbox-3" />
                          <label class="custom-control-label" for="checkbox-3"></label>
                        </div>
                      </td>
                      <td class="py-2 align-middle white-space-nowrap"><a href="../e-commerce/order-details.html"> <strong>#184</strong></a> by <strong>Bucky Robert</strong><br /><a href="mailto:bucky@example.com">bucky@example.com</a></td>
                      <td class="py-2 align-middle">30/04/2019</td>
                      <td class="py-2 align-middle">Bucky Robert, 1 Infinite Loop, Cupertino, California 90210
                        <p class="mb-0 text-500">Via Free Shipping</p>
                      </td>
                      <td class="py-2 align-middle text-center fs-0 white-space-nowrap"><span class="badge badge rounded-capsule d-block badge-warning">Pending<span class="ml-1 fas fa-stream" data-fa-transform="shrink-2"></span></span>
                      </td>
                      <td class="py-2 align-middle text-right fs-0 font-weight-medium">$92</td>
                      <td class="py-2 align-middle white-space-nowrap">
                        <div class="dropdown text-sans-serif">
                          <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal mr-3" type="button" id="order-dropdown-3" data-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false"><span class="fas fa-ellipsis-h fs--1"></span></button>
                          <div class="dropdown-menu dropdown-menu-right border py-0" aria-labelledby="order-dropdown-3">
                            <div class="bg-white py-2"><a class="dropdown-item" href="#!">Completed</a><a class="dropdown-item" href="#!">Processing</a><a class="dropdown-item" href="#!">On Hold</a><a class="dropdown-item" href="#!">Pending</a>
                              <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Delete</a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ContentBox>
    )
}

export default Orders