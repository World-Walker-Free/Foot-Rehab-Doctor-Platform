<template>
  <div class="container-fluid">
    <!-- 头部 -->
    <div class="header">
      <div class="header-title">
        <svg
          class="medical-kit-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V6H4C2.9 6 2 6.9 2 8V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V8C22 6.9 21.1 6 20 6ZM10 4H14V6H10V4ZM20 20H4V8H20V20Z"
          />
          <path d="M13 10H11V13H8V15H11V18H13V15H16V13H13V10Z" />
        </svg>
        医疗数据平台
      </div>
      <div class="user-info">
        <!-- 用户信息 -->
        <div class="user-profile">
          <div class="user-avatar">张</div>
          <div class="user-details">
            <div class="user-name">张医生</div>
            <div class="user-role">管理员</div>
          </div>
          <!-- 退出登录图标 -->
          <div class="logout-icon" @click="logout" title="退出登录">
            <i class="bi bi-box-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <i class="bi bi-person-lines-fill title-icon"></i>
          患者信息管理
        </h1>
      </div>

      <!-- 搜索区域 -->
      <div class="search-container">
        <div class="search-header">
          <h3 class="search-title">
            <i class="bi bi-search"></i>
            患者信息查询
          </h3>
        </div>

        <div class="search-bar">
          <div class="search-group">
            <label><i class="bi bi-hash"></i>序号</label>
            <input
              type="number"
              class="form-control"
              v-model="searchCriteria.id"
              placeholder="输入序号"
              min="1"
            />
          </div>

          <div class="search-group">
            <label><i class="bi bi-person"></i>姓名</label>
            <input
              type="text"
              class="form-control"
              v-model="searchCriteria.name"
              placeholder="输入姓名"
            />
          </div>

          <div class="search-group">
            <label><i class="bi bi-gender-ambiguous"></i>性别</label>
            <select
              class="form-control form-select"
              v-model="searchCriteria.gender"
            >
              <option value="">全部</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>

          <div class="search-group">
            <label><i class="bi bi-calendar"></i>年龄</label>
            <input
              type="number"
              class="form-control"
              v-model="searchCriteria.age"
              placeholder="输入年龄"
              min="0"
              max="120"
            />
          </div>

          <div class="search-group">
            <label><i class="bi bi-file-medical"></i>病历号</label>
            <input
              type="text"
              class="form-control"
              v-model="searchCriteria.medicalRecord"
              placeholder="输入病历号"
            />
          </div>

          <div class="button-group">
            <button class="btn btn-primary" @click="searchPatients">
              <i class="bi bi-search"></i> 查询
            </button>
            <button class="btn btn-outline-secondary" @click="resetSearch">
              <i class="bi bi-arrow-clockwise"></i> 重置
            </button>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <div class="table-header">
          <div class="table-title">
            <i class="bi bi-table"></i>
            患者信息列表
          </div>
          <div class="table-actions">
            <!-- 添加患者按钮 -->
            <button class="btn btn-success" @click="addNewPatient">
              <i class="bi bi-plus-circle"></i> 添加患者
            </button>
          </div>
          <div class="table-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalPatients }}</div>
              <div class="stat-label">患者总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ filteredPatients.length }}</div>
              <div class="stat-label">当前显示</div>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th>序号</th>
                <th>患者名称</th>
                <th>性别</th>
                <th>年龄</th>
                <th>病历号</th>
                <th>病况简述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentPagePatients.length === 0">
                <td colspan="7" class="no-results">
                  <div class="no-results-icon">
                    <i class="bi bi-search"></i>
                  </div>
                  <div class="no-results-title">未找到符合条件的患者</div>
                  <div class="no-results-text">
                    请尝试修改搜索条件或重置搜索
                  </div>
                </td>
              </tr>
              <tr
                v-for="patient in currentPagePatients"
                :key="patient.id"
                @mouseenter="hoverRow($event)"
                @mouseleave="unhoverRow($event)"
              >
                <td>
                  <strong>{{ patient.id }}</strong>
                </td>
                <td>{{ patient.name }}</td>
                <td>
                  <span
                    :class="`badge ${
                      patient.gender === '男' ? 'bg-primary' : 'bg-danger'
                    }`"
                    >{{ patient.gender }}</span
                  >
                </td>
                <td>
                  <span :class="`age-badge ${getAgeClass(patient.age)}`"
                    >{{ patient.age }}岁</span
                  >
                </td>
                <td>
                  <code>{{ patient.medicalRecord }}</code>
                </td>
                <td>
                  <small>{{ patient.diagnosis }}</small>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn btn-report"
                      @click="viewReport(patient)"
                      title="查看报告"
                    >
                      <i class="bi bi-file-medical"></i> 报告
                    </button>
                    <button
                      class="action-btn btn-edit"
                      @click="editPatient(patient)"
                      title="编辑信息"
                    >
                      <i class="bi bi-pencil"></i> 编辑
                    </button>

                    <button
                      class="action-btn btn-warning"
                      @click="openTaskModal(patient)"
                      title="任务"
                    >
                      <i class="bi bi-list-check"></i> 任务
                    </button>

                    <button
                      class="action-btn btn-delete"
                      @click="deletePatient(patient)"
                      title="删除记录"
                    >
                      <i class="bi bi-trash"></i> 删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="pagination-info">
          显示第 {{ startIndex }} 到 {{ endIndex }} 条，共
          {{ filteredPatients.length }} 条记录
        </div>
        <nav>
          <ul class="pagination">
            <li :class="`page-item ${currentPage === 1 ? 'disabled' : ''}`">
              <a class="page-link" href="#" @click.prevent="prevPage">
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>

            <li
              v-for="page in visiblePages"
              :key="page"
              :class="`page-item ${page === currentPage ? 'active' : ''}`"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(page)">
                {{ page }}
              </a>
            </li>

            <li v-if="endPage < totalPages">
              <span class="page-link">...</span>
            </li>

            <li v-if="endPage < totalPages" class="page-item">
              <a
                class="page-link"
                href="#"
                @click.prevent="goToPage(totalPages)"
              >
                {{ totalPages }}
              </a>
            </li>

            <li
              :class="`page-item ${
                currentPage === totalPages ? 'disabled' : ''
              }`"
            >
              <a class="page-link" href="#" @click.prevent="nextPage">
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 数据分析部分 -->
      <div class="analysis-section">
        <h2 class="section-title">
          <i class="bi bi-pie-chart"></i>
          患者数据分析
        </h2>

        <div class="analysis-container">
          <!-- 患者年龄段分析 -->
          <div class="analysis-card">
            <div class="analysis-title">
              <i class="bi bi-people"></i>
              患者年龄段分布
            </div>
            <div class="age-bar-container">
              <div class="age-bar" v-for="range in ageRanges" :key="range.key">
                <div class="age-label">{{ range.label }}</div>
                <div class="bar-bg">
                  <div
                    class="bar-fill"
                    :style="`width: ${
                      ageDistribution[range.key].percentage
                    }%; opacity: ${
                      ageDistribution[range.key].count === 0 ? 0.5 : 1
                    }`"
                  ></div>
                </div>
                <div class="bar-count">
                  {{ ageDistribution[range.key].count }}人
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-card">
            <div class="analysis-title">
              <i class="bi bi-gender-ambiguous"></i>
              患者性别分布
            </div>
            <div class="gender-analysis">
              <div class="gender-chart-container">
                <canvas ref="genderChartCanvas"></canvas>
              </div>
              <div class="gender-stats">
                <div class="gender-stat">
                  <div class="gender-label">
                    <div class="gender-color male-color"></div>
                    <span>男性</span>
                  </div>
                  <div class="gender-count">{{ genderStats.male }}人</div>
                  <div
                    class="gender-percentage"
                    v-if="genderStats.malePercentage > 0"
                  >
                    {{ genderStats.malePercentage }}%
                  </div>
                </div>
                <div class="gender-stat">
                  <div class="gender-label">
                    <div class="gender-color female-color"></div>
                    <span>女性</span>
                  </div>
                  <div class="gender-count">{{ genderStats.female }}人</div>
                  <div
                    class="gender-percentage"
                    v-if="genderStats.femalePercentage > 0"
                  >
                    {{ genderStats.femalePercentage }}%
                  </div>
                </div>
              </div>
              <div class="gender-ratio">男女比例：{{ genderStats.ratio }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑患者模态框 -->
    <div
      v-if="showEditModal"
      class="modal-backdrop"
      @click.self="closeEditModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-pencil"></i>
            {{ editingPatient.id ? "编辑患者信息" : "添加患者" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeEditModal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="savePatient">
            <!-- 基本信息 -->
            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-person"></i> 姓名</label
              >
              <input
                type="text"
                class="form-control"
                v-model="editingPatient.name"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-gender-ambiguous"></i> 性别</label
              >
              <select
                class="form-control"
                v-model="editingPatient.gender"
                required
              >
                <option value="">请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-calendar"></i> 年龄</label
              >
              <input
                type="number"
                class="form-control"
                v-model="editingPatient.age"
                min="0"
                max="120"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-file-medical"></i> 病历号</label
              >
              <input
                type="text"
                class="form-control"
                v-model="editingPatient.medicalRecord"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-file-earmark-text"></i> 诊断结果</label
              >
              <textarea
                class="form-control"
                v-model="editingPatient.diagnosis"
                rows="2"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-telephone"></i> 联系电话</label
              >
              <input
                type="tel"
                class="form-control"
                v-model="editingPatient.phone"
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-geo-alt"></i> 地址</label
              >
              <input
                type="text"
                class="form-control"
                v-model="editingPatient.address"
              />
            </div>

            <!-- 康复数据统计部分 -->
            <hr class="my-4" />
            <h6 class="mb-3"><i class="bi bi-graph-up"></i> 康复数据统计</h6>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label"
                  ><i class="bi bi-bar-chart"></i> 训练总次数</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="editingPatient.total_train_times"
                  min="0"
                  placeholder="0"
                  @input="calculateSuccessRate"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label"
                  ><i class="bi bi-check-circle"></i> 成功次数</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="editingPatient.success_times"
                  min="0"
                  placeholder="0"
                  @input="calculateSuccessRate"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label"
                  ><i class="bi bi-percent"></i> 成功率 (%)</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="editingPatient.success_rate"
                  readonly
                  disabled
                  style="background-color: #f5f5f5"
                />
                <small class="text-muted"
                  >成功率 = 成功次数 ÷ 总次数 × 100%</small
                >
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label"
                  ><i class="bi bi-graph-up"></i> 稳定性指数</label
                >
                <select
                  class="form-control"
                  v-model="editingPatient.stability_level"
                >
                  <option value="">请选择稳定性等级</option>
                  <option value="优">优 - 稳定 (80-100%)</option>
                  <option value="良">良 - 较好 (60-79%)</option>
                  <option value="中">中 - 一般 (40-59%)</option>
                  <option value="差">差 - 较差 (20-39%)</option>
                  <option value="极差">极差 - 不稳定 (0-19%)</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label"
                ><i class="bi bi-activity"></i> 疼痛指数 (0-10)</label
              >
              <div class="d-flex align-items-center gap-3">
                <input
                  type="range"
                  class="form-range flex-grow-1"
                  v-model="editingPatient.pain_level"
                  min="0"
                  max="10"
                  step="1"
                />
                <span
                  class="badge bg-danger"
                  style="font-size: 1rem; min-width: 50px"
                >
                  {{ editingPatient.pain_level || 0 }} / 10
                </span>
              </div>
              <small class="text-muted"
                >0=无痛, 1-3=轻度疼痛, 4-6=中度疼痛, 7-9=重度疼痛,
                10=剧痛</small
              >
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeEditModal"
              >
                <i class="bi bi-x-circle"></i> 取消
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-check-circle"></i> 保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 任务弹框 -->
    <div
      v-if="showTaskModal"
      class="modal-backdrop"
      @click.self="closeTaskModal"
    >
      <div class="modal-content" style="width: 950px; max-width: 95%">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-list-check"></i> 康复任务录入
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeTaskModal"
          ></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <!-- 左脚 -->
            <div class="col-md-6">
              <div class="task-side-header">
                <i class="bi bi-shoe-print"></i>
                <h6 class="text-center">左脚</h6>
              </div>

              <!-- 背屈 -->
              <div class="task-group">
                <div class="task-label">背屈</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.dorsiflexion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.dorsiflexion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.left.dorsiflexion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 跖屈 -->
              <div class="task-group">
                <div class="task-label">跖屈</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.plantarflexion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.plantarflexion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.left.plantarflexion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 内翻 -->
              <div class="task-group">
                <div class="task-label">内翻</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.inversion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.inversion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.left.inversion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 外翻 -->
              <div class="task-group">
                <div class="task-label">外翻</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.eversion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.left.eversion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.left.eversion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <div class="task-total">
                <label>左脚总次数</label>
                <input class="form-control" :value="leftTotal" disabled />
              </div>
            </div>

            <!-- 右脚 -->
            <div class="col-md-6">
              <div class="task-side-header">
                <i class="bi bi-shoe-print"></i>
                <h6 class="text-center">右脚</h6>
              </div>

              <!-- 背屈 -->
              <div class="task-group">
                <div class="task-label">背屈</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.dorsiflexion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.dorsiflexion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.right.dorsiflexion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 跖屈 -->
              <div class="task-group">
                <div class="task-label">跖屈</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.plantarflexion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.plantarflexion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.right.plantarflexion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 内翻 -->
              <div class="task-group">
                <div class="task-label">内翻</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.inversion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.inversion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.right.inversion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <!-- 外翻 -->
              <div class="task-group">
                <div class="task-label">外翻</div>
                <div class="task-input-group">
                  <div class="input-item">
                    <label>角度最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.eversion.max"
                      placeholder="最大值"
                    />
                  </div>
                  <div class="input-item">
                    <label>角度最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      class="form-control"
                      v-model.number="taskData.right.eversion.min"
                      placeholder="最小值"
                    />
                  </div>
                  <div class="input-item">
                    <label>次数</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="taskData.right.eversion.count"
                      placeholder="次数"
                    />
                  </div>
                </div>
              </div>

              <div class="task-total">
                <label>右脚总次数</label>
                <input class="form-control" :value="rightTotal" disabled />
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="d-flex mt-4 gap-3">
            <button class="btn btn-secondary w-50" @click="handleSaveTask">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import { Pie } from "vue3-chart-v2";

import {
  api,
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
  updatePatientAngles,
  getPatientAngles,
} from "@/api/patients";
import Chart from "chart.js/auto";

export default {
  name: "Information",
  setup() {
    const router = useRouter();

    // 数据状态
    const patients = ref([]);
    const filteredPatients = ref([]);
    const loading = ref(false);
    const showTaskModal = ref(false);
    const currentPatientId = ref(null);

    // 任务数据结构（包含角度最大最小值和次数）
    const taskData = ref({
      left: {
        dorsiflexion: { max: null, min: null, count: 0 },
        plantarflexion: { max: null, min: null, count: 0 },
        inversion: { max: null, min: null, count: 0 },
        eversion: { max: null, min: null, count: 0 },
      },
      right: {
        dorsiflexion: { max: null, min: null, count: 0 },
        plantarflexion: { max: null, min: null, count: 0 },
        inversion: { max: null, min: null, count: 0 },
        eversion: { max: null, min: null, count: 0 },
      },
    });

    // 左脚总次数
    const leftTotal = computed(() => {
      let total = 0;
      const keys = ["dorsiflexion", "plantarflexion", "inversion", "eversion"];
      for (const key of keys) {
        total += taskData.value.left[key]?.count || 0;
      }
      return total;
    });

    // 右脚总次数
    const rightTotal = computed(() => {
      let total = 0;
      const keys = ["dorsiflexion", "plantarflexion", "inversion", "eversion"];
      for (const key of keys) {
        total += taskData.value.right[key]?.count || 0;
      }
      return total;
    });

    const openTaskModal = async (patient) => {
      showTaskModal.value = true;
      currentPatientId.value = patient.id;

      // 重置任务数据
      taskData.value = {
        left: {
          dorsiflexion: { max: null, min: null, count: 0 },
          plantarflexion: { max: null, min: null, count: 0 },
          inversion: { max: null, min: null, count: 0 },
          eversion: { max: null, min: null, count: 0 },
        },
        right: {
          dorsiflexion: { max: null, min: null, count: 0 },
          plantarflexion: { max: null, min: null, count: 0 },
          inversion: { max: null, min: null, count: 0 },
          eversion: { max: null, min: null, count: 0 },
        },
      };

      // 尝试加载已有的角度数据
      try {
        const response = await getPatientAngles(patient.id);
        if (response.data) {
          const data = response.data;
          console.log("加载已有角度数据:", data);

          // 填充左脚数据
          taskData.value.left.dorsiflexion.max = data.left_down_angle_max;
          taskData.value.left.dorsiflexion.min = data.left_down_angle_min;
          taskData.value.left.plantarflexion.max = data.left_up_angle_max;
          taskData.value.left.plantarflexion.min = data.left_up_angle_min;
          taskData.value.left.inversion.max = data.left_inner_angle_max;
          taskData.value.left.inversion.min = data.left_inner_angle_min;
          taskData.value.left.eversion.max = data.left_outer_angle_max;
          taskData.value.left.eversion.min = data.left_outer_angle_min;

          // 填充右脚数据
          taskData.value.right.dorsiflexion.max = data.right_down_angle_max;
          taskData.value.right.dorsiflexion.min = data.right_down_angle_min;
          taskData.value.right.plantarflexion.max = data.right_up_angle_max;
          taskData.value.right.plantarflexion.min = data.right_up_angle_min;
          taskData.value.right.inversion.max = data.right_inner_angle_max;
          taskData.value.right.inversion.min = data.right_inner_angle_min;
          taskData.value.right.eversion.max = data.right_outer_angle_max;
          taskData.value.right.eversion.min = data.right_outer_angle_min;

          // 填充次数
          taskData.value.left.dorsiflexion.count =
            data.left_dorsiflexion_count || 0;
          taskData.value.left.plantarflexion.count =
            data.left_plantarflexion_count || 0;
          taskData.value.left.inversion.count = data.left_inversion_count || 0;
          taskData.value.left.eversion.count = data.left_eversion_count || 0;
          taskData.value.right.dorsiflexion.count =
            data.right_dorsiflexion_count || 0;
          taskData.value.right.plantarflexion.count =
            data.right_plantarflexion_count || 0;
          taskData.value.right.inversion.count =
            data.right_inversion_count || 0;
          taskData.value.right.eversion.count = data.right_eversion_count || 0;
        }
      } catch (error) {
        console.log("没有已保存的角度数据，使用默认值");
      }
    };

    const closeTaskModal = () => {
      showTaskModal.value = false;
    };

    const handleSaveTask = async () => {
      console.log("保存按钮被点击");
      const confirmed = await showConfirmDialog(
        "是否保存当前任务？",
        "保存确认",
      );
      if (!confirmed) return;

      try {
        // 构建保存到数据库的数据格式
        const taskToSave = {
          // 左脚 - 背屈
          left_down_angle_max:
            taskData.value.left.dorsiflexion.max !== undefined &&
            taskData.value.left.dorsiflexion.max !== ""
              ? parseFloat(taskData.value.left.dorsiflexion.max)
              : null,
          left_down_angle_min:
            taskData.value.left.dorsiflexion.min !== undefined &&
            taskData.value.left.dorsiflexion.min !== ""
              ? parseFloat(taskData.value.left.dorsiflexion.min)
              : null,
          // 左脚 - 跖屈
          left_up_angle_max:
            taskData.value.left.plantarflexion.max !== undefined &&
            taskData.value.left.plantarflexion.max !== ""
              ? parseFloat(taskData.value.left.plantarflexion.max)
              : null,
          left_up_angle_min:
            taskData.value.left.plantarflexion.min !== undefined &&
            taskData.value.left.plantarflexion.min !== ""
              ? parseFloat(taskData.value.left.plantarflexion.min)
              : null,
          // 左脚 - 内翻
          left_inner_angle_max:
            taskData.value.left.inversion.max !== undefined &&
            taskData.value.left.inversion.max !== ""
              ? parseFloat(taskData.value.left.inversion.max)
              : null,
          left_inner_angle_min:
            taskData.value.left.inversion.min !== undefined &&
            taskData.value.left.inversion.min !== ""
              ? parseFloat(taskData.value.left.inversion.min)
              : null,
          // 左脚 - 外翻
          left_outer_angle_max:
            taskData.value.left.eversion.max !== undefined &&
            taskData.value.left.eversion.max !== ""
              ? parseFloat(taskData.value.left.eversion.max)
              : null,
          left_outer_angle_min:
            taskData.value.left.eversion.min !== undefined &&
            taskData.value.left.eversion.min !== ""
              ? parseFloat(taskData.value.left.eversion.min)
              : null,
          // 右脚 - 背屈
          right_down_angle_max:
            taskData.value.right.dorsiflexion.max !== undefined &&
            taskData.value.right.dorsiflexion.max !== ""
              ? parseFloat(taskData.value.right.dorsiflexion.max)
              : null,
          right_down_angle_min:
            taskData.value.right.dorsiflexion.min !== undefined &&
            taskData.value.right.dorsiflexion.min !== ""
              ? parseFloat(taskData.value.right.dorsiflexion.min)
              : null,
          // 右脚 - 跖屈
          right_up_angle_max:
            taskData.value.right.plantarflexion.max !== undefined &&
            taskData.value.right.plantarflexion.max !== ""
              ? parseFloat(taskData.value.right.plantarflexion.max)
              : null,
          right_up_angle_min:
            taskData.value.right.plantarflexion.min !== undefined &&
            taskData.value.right.plantarflexion.min !== ""
              ? parseFloat(taskData.value.right.plantarflexion.min)
              : null,
          // 右脚 - 内翻
          right_inner_angle_max:
            taskData.value.right.inversion.max !== undefined &&
            taskData.value.right.inversion.max !== ""
              ? parseFloat(taskData.value.right.inversion.max)
              : null,
          right_inner_angle_min:
            taskData.value.right.inversion.min !== undefined &&
            taskData.value.right.inversion.min !== ""
              ? parseFloat(taskData.value.right.inversion.min)
              : null,
          // 右脚 - 外翻
          right_outer_angle_max:
            taskData.value.right.eversion.max !== undefined &&
            taskData.value.right.eversion.max !== ""
              ? parseFloat(taskData.value.right.eversion.max)
              : null,
          right_outer_angle_min:
            taskData.value.right.eversion.min !== undefined &&
            taskData.value.right.eversion.min !== ""
              ? parseFloat(taskData.value.right.eversion.min)
              : null,
          // 各动作次数
          left_dorsiflexion_count:
            parseInt(taskData.value.left.dorsiflexion.count) || 0,
          left_plantarflexion_count:
            parseInt(taskData.value.left.plantarflexion.count) || 0,
          left_inversion_count:
            parseInt(taskData.value.left.inversion.count) || 0,
          left_eversion_count:
            parseInt(taskData.value.left.eversion.count) || 0,
          right_dorsiflexion_count:
            parseInt(taskData.value.right.dorsiflexion.count) || 0,
          right_plantarflexion_count:
            parseInt(taskData.value.right.plantarflexion.count) || 0,
          right_inversion_count:
            parseInt(taskData.value.right.inversion.count) || 0,
          right_eversion_count:
            parseInt(taskData.value.right.eversion.count) || 0,
        };

        console.log("保存任务数据到数据库：", taskToSave);

        const response = await updatePatientAngles(
          currentPatientId.value,
          taskToSave,
        );

        if (response.data.success) {
          showSuccessNotification("任务数据保存成功！");
          closeTaskModal();
        } else {
          showErrorNotification(
            "保存失败：" + (response.data.message || "未知错误"),
          );
        }
      } catch (error) {
        console.error("保存任务数据失败:", error);
        showErrorNotification(
          "保存任务数据失败：" +
            (error.response?.data?.error || error.message || "网络错误"),
        );
      }
    };

    const handleSendTask = async () => {
      const confirmed = await showConfirmDialog("是否发送任务？", "发送确认");
      if (!confirmed) return;

      console.log("发送任务数据：", taskData.value);
      showSuccessNotification("任务已发送");
    };

    const calculatedSuccessRate = computed(() => {
      const total = editingPatient.value?.total_train_times || 0;
      const success = editingPatient.value?.success_times || 0;

      if (total === 0 || success === 0) {
        return 0;
      }

      const rate = (success / total) * 100;
      return rate.toFixed(1);
    });

    const updateSuccessRate = () => {
      if (editingPatient.value) {
        editingPatient.value.success_rate = parseFloat(
          calculatedSuccessRate.value,
        );
        console.log("成功率已更新:", editingPatient.value.success_rate);
      }
    };

    const computedSuccessRate = computed(() => {
      const total = editingPatient.value?.total_train_times || 0;
      const success = editingPatient.value?.success_times || 0;

      if (total === 0) {
        return 0;
      }

      const rate = (success / total) * 100;
      return rate.toFixed(1);
    });

    const calculateSuccessRate = () => {
      const total = parseInt(editingPatient.value.total_train_times) || 0;
      const success = parseInt(editingPatient.value.success_times) || 0;

      if (total > 0 && success >= 0) {
        const rate = (success / total) * 100;
        editingPatient.value.success_rate = rate.toFixed(1);
      } else {
        editingPatient.value.success_rate = 0;
      }
    };

    // 搜索条件
    const searchCriteria = ref({
      id: "",
      name: "",
      gender: "",
      age: "",
      medicalRecord: "",
    });

    // 分页相关
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const maxVisiblePages = 5;

    // 编辑模态框
    const showEditModal = ref(false);
    const editingPatient = ref(null);

    // 图表引用
    const genderChartCanvas = ref(null);
    let genderChart = null;

    // 年龄段定义
    const ageRanges = ref([
      { key: "60plus", label: "60岁以上", min: 60, max: 150 },
      { key: "45-60", label: "45-60岁", min: 45, max: 60 },
      { key: "36-45", label: "36-45岁", min: 36, max: 45 },
      { key: "24-36", label: "24-36岁", min: 24, max: 36 },
      { key: "18-24", label: "18-24岁", min: 18, max: 24 },
      { key: "10-18", label: "10-18岁", min: 10, max: 18 },
      { key: "0-10", label: "0-10岁", min: 0, max: 10 },
    ]);

    // 性别统计数据
    const genderStats = computed(() => {
      const maleCount = filteredPatients.value.filter(
        (p) => p.gender === "男",
      ).length;
      const femaleCount = filteredPatients.value.filter(
        (p) => p.gender === "女",
      ).length;
      const total = maleCount + femaleCount;

      return {
        male: maleCount,
        female: femaleCount,
        malePercentage: total > 0 ? ((maleCount / total) * 100).toFixed(1) : 0,
        femalePercentage:
          total > 0 ? ((femaleCount / total) * 100).toFixed(1) : 0,
        ratio:
          maleCount === 0 && femaleCount === 0
            ? "0:0"
            : `${maleCount}:${femaleCount}`,
      };
    });

    // 计算属性
    const totalPatients = computed(() => patients.value.length);
    const totalPages = computed(() =>
      Math.ceil(filteredPatients.value.length / itemsPerPage),
    );
    const startIndex = computed(
      () => (currentPage.value - 1) * itemsPerPage + 1,
    );
    const endIndex = computed(() =>
      Math.min(currentPage.value * itemsPerPage, filteredPatients.value.length),
    );
    const currentPagePatients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPatients.value.slice(start, end);
    });

    const visiblePages = computed(() => {
      let startPage = Math.max(
        1,
        currentPage.value - Math.floor(maxVisiblePages / 2),
      );
      let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    const endPage = computed(
      () => visiblePages.value[visiblePages.value.length - 1],
    );

    // 年龄段分布
    const ageDistribution = computed(() => {
      const distribution = {};
      const maxAgeCount = Math.max(
        ...ageRanges.value.map((range) => {
          const count = filteredPatients.value.filter(
            (patient) => patient.age >= range.min && patient.age < range.max,
          ).length;
          distribution[range.key] = { count, percentage: 0 };
          return count;
        }),
        1,
      );

      ageRanges.value.forEach((range) => {
        distribution[range.key].percentage =
          (distribution[range.key].count / maxAgeCount) * 100;
      });

      return distribution;
    });

    // 方法
    const getAgeClass = (age) => {
      if (age < 18) return "age-child";
      if (age >= 18 && age < 30) return "age-youth";
      if (age >= 30 && age < 45) return "age-adult";
      if (age >= 45 && age < 60) return "age-middle";
      return "age-senior";
    };

    // 初始化图表
    const initGenderChart = () => {
      if (!genderChartCanvas.value) return;

      const ctx = genderChartCanvas.value.getContext("2d");

      if (genderChart) {
        genderChart.destroy();
      }

      genderChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["男性", "女性"],
          datasets: [
            {
              data: [genderStats.value.male, genderStats.value.female],
              backgroundColor: ["#3498db", "#e74c3c"],
              borderWidth: 2,
              borderColor: "#fff",
              hoverOffset: 15,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total =
                    genderStats.value.male + genderStats.value.female;
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value}人 (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    };

    // 更新图表数据
    const updateGenderChart = () => {
      if (genderChart) {
        genderChart.data.datasets[0].data = [
          genderStats.value.male,
          genderStats.value.female,
        ];
        genderChart.update();
      } else {
        initGenderChart();
      }
    };

    // 加载患者数据
    const fetchPatients = async () => {
      try {
        loading.value = true;
        const response = await getPatients();

        console.log("从云开发获取的患者数据:", response.data);

        patients.value = response.data.map((patient) => ({
          id: patient.id,
          name: patient.name,
          gender: patient.gender,
          age: patient.age,
          medicalRecord:
            patient.medical_num || `MR${String(patient.id).padStart(3, "0")}`,
          diagnosis: patient.diagnosis || "暂无诊断",
          phone: patient.contact || "",
          address: patient.notes || "",
          total_train_times: patient.total_train_times || 0,
          success_times: patient.success_times || 0,
          success_rate: patient.success_rate || 0,
          stability_level: patient.stability_level || "",
          pain_level: patient.pain_level || 0,
          doctor: patient.doctor || "张医生",
          status: patient.status || "active",
          admission_date: patient.admission_date,
          last_visit: patient.last_visit,
        }));

        filteredPatients.value = [...patients.value];
        console.log(`成功加载 ${patients.value.length} 条患者数据`);

        setTimeout(() => initGenderChart(), 100);
      } catch (error) {
        console.error("加载患者数据失败:", error);
        showErrorNotification(`加载患者数据失败: ${error.message}`);

        if (error.code === "ERR_NETWORK") {
          showErrorNotification(
            "无法连接到服务器，请确保后端服务已启动 (npm run server)",
          );
        }
      } finally {
        loading.value = false;
      }
    };

    // 自定义通知函数
    const showErrorNotification = (message) => {
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        border: 1px solid #f5c6cb;
        max-width: 400px;
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    };

    const showSuccessNotification = (message) => {
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        border: 1px solid #c3e6cb;
        max-width: 400px;
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    };

    // 添加CSS动画
    const addNotificationStyles = () => {
      if (!document.getElementById("notification-styles")) {
        const style = document.createElement("style");
        style.id = "notification-styles";
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    };

    // 搜索患者
    const searchPatients = () => {
      const criteria = searchCriteria.value;
      filteredPatients.value = patients.value.filter((patient) => {
        for (const [field, value] of Object.entries(criteria)) {
          if (!value) continue;

          if (field === "id" || field === "age") {
            if (patient[field] !== parseInt(value)) return false;
          } else if (field === "gender") {
            if (patient[field] !== value) return false;
          } else {
            const patientValue = String(patient[field]).toLowerCase();
            if (!patientValue.includes(value.toLowerCase())) return false;
          }
        }
        return true;
      });

      currentPage.value = 1;
      updateGenderChart();
    };

    // 重置搜索
    const resetSearch = () => {
      searchCriteria.value = {
        id: "",
        name: "",
        gender: "",
        age: "",
        medicalRecord: "",
      };
      filteredPatients.value = [...patients.value];
      currentPage.value = 1;
      updateGenderChart();
    };

    // 分页方法
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const goToPage = (page) => {
      currentPage.value = page;
    };

    // 查看报告
    const viewReport = (patient) => {
      router.push(`/report/${patient.id}`);
    };

    const addNewPatient = () => {
      editingPatient.value = {
        id: null,
        name: "",
        medical_num: "",
        gender: "",
        age: "",
        medicalRecord: "",
        diagnosis: "",
        phone: "",
        address: "",
        total_train_times: "",
        success_times: "",
        success_rate: "",
        stability_level: "",
        pain_level: "",
      };
      showEditModal.value = true;
    };

    // 编辑患者
    const editPatient = (patient) => {
      editingPatient.value = patient
        ? {
            id: patient.id,
            name: patient.name,
            gender: patient.gender,
            age: patient.age,
            medicalRecord: patient.medicalRecord,
            diagnosis: patient.diagnosis,
            phone: patient.phone,
            address: patient.address,
            total_train_times: patient.total_train_times || 0,
            success_times: patient.success_times || 0,
            success_rate: patient.success_rate || 0,
            stability_level: patient.stability_level || "",
            pain_level: Math.floor(patient.pain_level || 0),
          }
        : {
            id: null,
            name: "",
            gender: "",
            age: "",
            medicalRecord: "",
            diagnosis: "",
            phone: "",
            address: "",
            total_train_times: 0,
            success_times: 0,
            success_rate: 0,
            stability_level: "",
            pain_level: 0,
          };
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
    };

    // 保存患者
    const savePatient = async () => {
      try {
        console.log("保存患者:", editingPatient.value);

        if (!editingPatient.value.name?.trim()) {
          showErrorNotification("请输入患者姓名");
          return;
        }

        if (!editingPatient.value.gender) {
          showErrorNotification("请选择患者性别");
          return;
        }

        if (!editingPatient.value.age || editingPatient.value.age < 0) {
          showErrorNotification("请输入有效的年龄");
          return;
        }

        calculateSuccessRate();

        const patientData = {
          name: editingPatient.value.name.trim(),
          gender: editingPatient.value.gender,
          age: parseInt(editingPatient.value.age),
          diagnosis: editingPatient.value.diagnosis?.trim() || "暂无诊断",
          contact: editingPatient.value.phone?.trim() || "",
          notes: editingPatient.value.address?.trim() || "",
          doctor: "张医生",
          total_train_times:
            parseInt(editingPatient.value.total_train_times) || 0,
          success_times: parseInt(editingPatient.value.success_times) || 0,
          success_rate: parseFloat(editingPatient.value.success_rate) || 0,
          stability_level: editingPatient.value.stability_level || "",
          pain_level: parseInt(editingPatient.value.pain_level) || 0,
        };

        console.log("发送到云开发的数据:", patientData);

        if (editingPatient.value.id) {
          const response = await updatePatient(
            editingPatient.value.id,
            patientData,
          );
          console.log("更新响应:", response.data);
          showSuccessNotification("患者信息更新成功");

          const index = patients.value.findIndex(
            (p) => p.id === editingPatient.value.id,
          );
          if (index !== -1) {
            patients.value[index] = {
              ...patients.value[index],
              name: editingPatient.value.name,
              gender: editingPatient.value.gender,
              age: editingPatient.value.age,
              diagnosis: editingPatient.value.diagnosis,
              phone: editingPatient.value.phone,
              address: editingPatient.value.address,
              total_train_times: patientData.total_train_times,
              success_times: patientData.success_times,
              success_rate: patientData.success_rate,
              stability_level: patientData.stability_level,
              pain_level: patientData.pain_level,
            };
            filteredPatients.value = [...patients.value];
          }
        } else {
          const response = await addPatient(patientData);
          const newPatient = response.data;
          console.log("添加响应:", newPatient);

          patients.value.push({
            id: newPatient.id,
            name: newPatient.name,
            gender: newPatient.gender,
            age: newPatient.age,
            medicalRecord: `MR${String(newPatient.id).padStart(3, "0")}`,
            diagnosis: newPatient.diagnosis,
            phone: newPatient.contact || "",
            address: newPatient.notes || "",
            total_train_times: newPatient.total_train_times || 0,
            success_times: newPatient.success_times || 0,
            success_rate: newPatient.success_rate || 0,
            stability_level: newPatient.stability_level || "",
            pain_level: newPatient.pain_level || 0,
          });
          filteredPatients.value = [...patients.value];
          showSuccessNotification("患者添加成功");
        }

        closeEditModal();
        updateGenderChart();
      } catch (error) {
        console.error("保存失败:", error);
      }
    };

    // 自定义确认对话框
    const showConfirmDialog = (message, title = "确认操作") => {
      return new Promise((resolve) => {
        const dialog = document.createElement("div");
        const overlay = document.createElement("div");

        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        `;

        dialog.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 9999;
          width: 400px;
          max-width: 90%;
          animation: scaleIn 0.3s ease;
        `;

        dialog.innerHTML = `
          <div style="padding: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #333; font-size: 18px;">${title}</h3>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.5;">${message}</p>
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
              <button id="cancel-btn" style="padding: 8px 20px; border: 1px solid #ddd; background: #f8f9fa; border-radius: 6px; cursor: pointer; font-size: 14px; color: #666;">
                取消
              </button>
              <button id="confirm-btn" style="padding: 8px 20px; border: none; background: linear-gradient(135deg, #18bc9c, #2ecc71); color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                确定
              </button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        const style = document.createElement("style");
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
        `;
        document.head.appendChild(style);

        document.getElementById("cancel-btn").onclick = () => {
          document.body.removeChild(dialog);
          document.body.removeChild(overlay);
          document.head.removeChild(style);
          resolve(false);
        };

        document.getElementById("confirm-btn").onclick = () => {
          document.body.removeChild(dialog);
          document.body.removeChild(overlay);
          document.head.removeChild(style);
          resolve(true);
        };

        const handleEsc = (e) => {
          if (e.key === "Escape") {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
            document.head.removeChild(style);
            document.removeEventListener("keydown", handleEsc);
            resolve(false);
          }
        };
        document.addEventListener("keydown", handleEsc);
      });
    };

    // 删除患者
    const deletePatientHandler = async (patient) => {
      const confirmed = await showConfirmDialog(
        `确定要删除患者 "${patient.name}" 的记录吗？此操作不可撤销。`,
        "删除确认",
      );

      if (!confirmed) return;

      try {
        await deletePatient(patient.id);
        console.log(`患者 ${patient.id} 删除成功`);

        patients.value = patients.value.filter((p) => p.id !== patient.id);
        filteredPatients.value = filteredPatients.value.filter(
          (p) => p.id !== patient.id,
        );

        showSuccessNotification("患者记录已删除");
        updateGenderChart();
      } catch (error) {
        console.error("删除失败:", error);
      }
    };

    const showInfoNotification = (message) => {
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d1ecf1;
        color: #0c5460;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        border: 1px solid #bee5eb;
        max-width: 400px;
        white-space: pre-line;
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 4000);
    };

    // 退出登录
    const logout = async () => {
      const confirmed = await showConfirmDialog(
        "确定要退出登录吗？",
        "退出确认",
      );

      if (!confirmed) return;

      try {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("doctorInfo");

        sessionStorage.clear();

        showSuccessNotification("已退出登录");

        router.replace("/login");
      } catch (error) {
        console.error("退出登录失败:", error);
        showErrorNotification("退出登录失败");
      }
    };

    // 行悬停效果
    const hoverRow = (event) => {
      event.currentTarget.style.transform = "translateX(5px)";
      event.currentTarget.style.transition = "transform 0.3s ease";
    };

    const unhoverRow = (event) => {
      event.currentTarget.style.transform = "translateX(0)";
    };

    // 动作名称映射
    const getActionName = (action) => {
      const names = {
        dorsiflexion: "背屈",
        plantarflexion: "跖屈",
        inversion: "内翻",
        eversion: "外翻",
      };
      return names[action] || action;
    };

    // 疼痛等级样式
    const getPainBadgeClass = (level) => {
      if (level <= 2) return "pain-low";
      if (level <= 4) return "pain-mild";
      if (level <= 6) return "pain-moderate";
      return "pain-high";
    };

    // 监听数据变化
    watch(
      () => filteredPatients.value,
      () => {
        updateGenderChart();
      },
      { deep: true },
    );

    // 生命周期
    onMounted(() => {
      addNotificationStyles();
      fetchPatients();

      setTimeout(() => {
        initGenderChart();
      }, 100);
    });

    onBeforeUnmount(() => {
      if (genderChart) {
        genderChart.destroy();
      }
    });

    return {
      addNewPatient,
      patients,
      filteredPatients,
      searchCriteria,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      currentPagePatients,
      visiblePages,
      endPage,
      showEditModal,
      editingPatient,
      ageRanges,
      ageDistribution,
      genderStats,
      genderChartCanvas,
      loading,
      totalPatients,
      computedSuccessRate,
      calculatedSuccessRate,
      showTaskModal,
      taskData,
      leftTotal,
      rightTotal,
      currentPatientId,
      openTaskModal,
      closeTaskModal,
      handleSaveTask,
      handleSendTask,
      getAgeClass,
      searchPatients,
      resetSearch,
      prevPage,
      nextPage,
      goToPage,
      viewReport,
      editPatient,
      closeEditModal,
      savePatient,
      deletePatient: deletePatientHandler,
      logout,
      hoverRow,
      unhoverRow,
      getActionName,
      getPainBadgeClass,
      fetchPatients,
      calculateSuccessRate,
      updateSuccessRate,
    };
  },
};
</script>

<style scoped>
/* 原CSS样式保留，但图标类名改为Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");

/* 退出登录图标样式 */
.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0.5rem;
}

.logout-icon:hover {
  background-color: rgba(24, 188, 156, 0.1);
  color: #18bc9c;
  transform: scale(1.05);
}

.logout-icon i {
  font-size: 1.2rem;
}

/* 用户信息样式优化 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  background: none;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 2px 6px rgba(24, 188, 156, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* 模态框样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: backdropFadeIn 0.25s ease;
}

@keyframes backdropFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gender-percentage {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 0.3rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: modalSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 任务弹框样式覆盖 */
.modal-content[style*="width: 950px"] {
  max-width: 95%;
  width: 950px !important;
}

.modal-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 1.2rem 1.5rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.modal-body {
  padding: 2rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  opacity: 0.8;
}

.btn-close:hover {
  opacity: 1;
}

/* 任务弹框样式 */
.task-side-header {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
  padding: 8px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 10px;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.task-side-header i {
  font-size: 24px;
  color: #18bc9c;
}

.task-group {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 3px solid #18bc9c;
}

.task-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 14px;
}

.task-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.input-item {
  flex: 1;
  min-width: 80px;
}

.input-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.input-item input {
  font-size: 13px;
  padding: 6px 10px;
}

.task-total {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 10px;
  border: 1px solid #bbf7d0;
}

.task-total label {
  font-weight: 600;
  color: #15803d;
  margin-bottom: 8px;
  display: block;
}

/* 其他原有样式保持不变 */
body {
  background-color: #f1f5f9;
  font-family: "Microsoft Yahei", sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.container-fluid {
  padding: 0;
  background: #f1f5f9;
  min-height: 100vh;
}

.row {
  margin: 0;
}

/* 头部样式 */
.header {
  background-color: #fff;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
  border-bottom: 1px solid #e2e8f0;
}

.header:hover {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.medical-kit-icon {
  width: 26px;
  height: 26px;
  fill: #18bc9c;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 主要内容区域 */
.main-content {
  padding: 1.5rem 2rem;
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 2px solid #e2e8f0;
  animation: containerFadeIn 0.5s ease;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.title-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

/* 搜索栏样式 */
.search-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  animation: containerFadeIn 0.5s ease;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f1f5f9;
}

.search-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.search-title i {
  color: #18bc9c;
}

.search-bar {
  display: flex;
  gap: 1.2rem;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: space-between;
}

.search-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  flex: 1;
}

.search-group label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-group label i {
  color: #18bc9c;
  font-size: 0.9rem;
}

.table-responsive {
  position: relative;
  min-height: 300px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 15px 15px;
  z-index: 10;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #18bc9c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.search-group .form-control,
.search-group .form-select {
  height: 40px;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
}

.search-group .form-control:focus,
.search-group .form-select:focus {
  border-color: #18bc9c;
  box-shadow: 0 0 0 3px rgba(24, 188, 156, 0.1);
  background: white;
}

.button-group {
  display: flex;
  gap: 1rem;
  min-width: 200px;
  margin-left: auto;
}

.btn {
  height: 40px;
  font-size: 0.9rem;
  white-space: nowrap;
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 188, 156, 0.25);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #14a388, #27ae60);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(24, 188, 156, 0.4);
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: transparent;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateY(-2px) scale(1.02);
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  animation: containerFadeIn 0.5s ease 0.1s backwards;
}

.table-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-success {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border: none;
  box-shadow: 0 2px 8px rgba(24, 188, 156, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-success:hover {
  background: linear-gradient(135deg, #14a388, #27ae60);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 188, 156, 0.3);
}

.table-stats {
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.table-title i {
  color: #18bc9c;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #18bc9c;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* 表格美化 */
.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead th {
  background-color: #f8fafc;
  border: none;
  padding: 1rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  text-align: center;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table tbody td {
  padding: 0.8rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  color: #334155;
}

.table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  animation: rowFadeIn 0.4s ease backwards;
}

.table tbody tr:hover {
  background-color: rgba(24, 188, 156, 0.04);
  box-shadow: inset 3px 0 0 #18bc9c;
}

.table tbody tr:nth-child(1) { animation-delay: 0.05s; }
.table tbody tr:nth-child(2) { animation-delay: 0.1s; }
.table tbody tr:nth-child(3) { animation-delay: 0.15s; }
.table tbody tr:nth-child(4) { animation-delay: 0.2s; }
.table tbody tr:nth-child(5) { animation-delay: 0.25s; }
.table tbody tr:nth-child(6) { animation-delay: 0.3s; }
.table tbody tr:nth-child(7) { animation-delay: 0.35s; }
.table tbody tr:nth-child(8) { animation-delay: 0.4s; }
.table tbody tr:nth-child(9) { animation-delay: 0.45s; }
.table tbody tr:nth-child(10) { animation-delay: 0.5s; }

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.table tbody tr:hover {
  background-color: rgba(24, 188, 156, 0.05);
  transform: translateX(5px);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* 年龄徽章 */
.age-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  min-width: 50px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.age-badge:hover {
  transform: scale(1.05);
}

.age-child {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1565c0;
  border: 1px solid #90caf9;
}

.age-youth {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

.age-adult {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.age-middle {
  background: linear-gradient(135deg, #fff3e0, #ffcc80);
  color: #ef6c00;
  border: 1px solid #ffb74d;
}

.age-senior {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #c62828;
  border: 1px solid #ef9a9a;
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 55px;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.btn-report {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.btn-report:hover {
  background: linear-gradient(135deg, #2980b9, #1f639e);
}

.btn-edit {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.btn-edit:hover {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

.btn-warning {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.btn-delete {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
}

/* 分页美化 */
.pagination-container {
  background: white;
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: containerFadeIn 0.5s ease 0.2s backwards;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

.pagination {
  margin: 0;
}

.page-item .page-link {
  border: none;
  color: #666;
  margin: 0 0.3rem;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
  box-shadow: 0 4px 8px rgba(24, 188, 156, 0.25);
}

.page-item:not(.active) .page-link:hover {
  background-color: rgba(24, 188, 156, 0.1);
  color: #18bc9c;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
}

.no-results-icon {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.no-results-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
}

.no-results-text {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* 数据分析部分 */
.analysis-section {
  margin-top: 2.5rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #18bc9c, #2ecc71, transparent) 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.section-title i {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.analysis-container {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.analysis-card {
  flex: 1;
  min-width: 350px;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.analysis-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(24, 188, 156, 0.1);
  border-color: rgba(24, 188, 156, 0.2);
}

.analysis-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.analysis-title i {
  color: #18bc9c;
}

.age-bar-container {
  margin-top: 1rem;
}

.age-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  animation: barSlideIn 0.5s ease backwards;
}

.age-bar:nth-child(1) { animation-delay: 0.1s; }
.age-bar:nth-child(2) { animation-delay: 0.15s; }
.age-bar:nth-child(3) { animation-delay: 0.2s; }
.age-bar:nth-child(4) { animation-delay: 0.25s; }
.age-bar:nth-child(5) { animation-delay: 0.3s; }
.age-bar:nth-child(6) { animation-delay: 0.35s; }
.age-bar:nth-child(7) { animation-delay: 0.4s; }

@keyframes barSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.age-label {
  width: 80px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.bar-bg {
  flex: 1;
  height: 24px;
  background-color: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 1rem;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #18bc9c, #2ecc71);
  border-radius: 12px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 8px;
}

.bar-count {
  width: 60px;
  text-align: right;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.85rem;
}

.gender-analysis {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

.gender-chart-container {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  flex-shrink: 0;
  overflow: hidden;
}

.gender-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 1.5rem;
}

.gender-stat {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
}

.gender-stat:hover {
  background: rgba(0, 0, 0, 0.02);
  transform: translateY(-3px);
}

.gender-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.gender-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.male-color {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.female-color {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.gender-count {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}

.gender-ratio {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
  padding: 0.6rem 1.2rem;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .user-name,
  .user-role {
    display: none;
  }

  .logout-icon {
    margin-left: 0;
  }

  .modal-content[style*="width: 950px"] {
    width: 95% !important;
  }
}
</style>
