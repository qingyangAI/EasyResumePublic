import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ResumeEditor({ data, onChange }) {
  const [localData, setLocalData] = useState(data);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data) {
      // 确保sectionOrder包含所有必要的section，兼容旧数据
      const defaultOrder = ["tags", "advantages", "education", "workExperiences", "honors", "projects"]
      let sectionOrder = data.sectionOrder || [...defaultOrder]
      
      // 如果旧数据中没有advantages，添加到合适的位置（在tags之后）
      if (!sectionOrder.includes("advantages")) {
        const tagsIndex = sectionOrder.indexOf("tags")
        if (tagsIndex >= 0) {
          sectionOrder.splice(tagsIndex + 1, 0, "advantages")
        } else {
          sectionOrder.unshift("advantages")
        }
      }
      
      const normalizedData = {
        personalInfo: {
          name: data.personalInfo?.name || "",
          title: data.personalInfo?.title || "",
          phone: data.personalInfo?.phone || "",
          email: data.personalInfo?.email || "",
          age: data.personalInfo?.age || "",
          blog: data.personalInfo?.blog || "",
          github: data.personalInfo?.github || "",
          targetCity: data.personalInfo?.targetCity || "",
          works: data.personalInfo?.works || [],
        },
        sectionOrder: sectionOrder,
        tags: data.tags || [],
        advantages: data.advantages || [],
        honors: data.honors || [],
        workExperiences: (() => {
          const workExps = data.workExperiences || [];
          return workExps.map((work) => {
            const normalizedWork = {
              ...work,
              startYear: work.startYear || null,
              startMonth: work.startMonth || null,
              endYear: work.endYear || null,
              endMonth: work.endMonth || null,
              isPresent: work.isPresent || false,
            };

            // 如果 period 存在但没有年月字段，尝试解析
            if (work.period && !work.startYear) {
              // 检查是否包含"至今"
              if (work.period.includes('至今')) {
                const periodMatch = work.period.match(
                  /(\d{4})年(\d{1,2})月\s*[—\-]\s*至今/
                );
                if (periodMatch) {
                  normalizedWork.startYear = parseInt(periodMatch[1]);
                  normalizedWork.startMonth = parseInt(periodMatch[2]);
                  normalizedWork.endYear = new Date().getFullYear();
                  normalizedWork.endMonth = new Date().getMonth() + 1;
                  normalizedWork.isPresent = true;
                }
              } else {
                const periodMatch = work.period.match(
                  /(\d{4})年(\d{1,2})月\s*[—\-]\s*(\d{4})年(\d{1,2})月/
                );
                if (periodMatch) {
                  normalizedWork.startYear = parseInt(periodMatch[1]);
                  normalizedWork.startMonth = parseInt(periodMatch[2]);
                  normalizedWork.endYear = parseInt(periodMatch[3]);
                  normalizedWork.endMonth = parseInt(periodMatch[4]);
                  normalizedWork.isPresent = false;
                }
              }
            }

            return normalizedWork;
          });
        })(),
        projects: (() => {
          const projects = data.projects || [];
          return projects.map((project) => {
            const normalizedProject = {
              ...project,
              startYear: project.startYear || null,
              startMonth: project.startMonth || null,
              endYear: project.endYear || null,
              endMonth: project.endMonth || null,
              isPresent: project.isPresent || false,
            };

            // 如果 period 存在但没有年月字段，尝试解析
            if (project.period && !project.startYear) {
              // 检查是否包含"至今"
              if (project.period.includes('至今')) {
                const periodMatch = project.period.match(
                  /(\d{4})年(\d{1,2})月\s*[—\-]\s*至今/
                );
                if (periodMatch) {
                  normalizedProject.startYear = parseInt(periodMatch[1]);
                  normalizedProject.startMonth = parseInt(periodMatch[2]);
                  normalizedProject.endYear = new Date().getFullYear();
                  normalizedProject.endMonth = new Date().getMonth() + 1;
                  normalizedProject.isPresent = true;
                }
              } else {
                const periodMatch = project.period.match(
                  /(\d{4})年(\d{1,2})月\s*[—\-]\s*(\d{4})年(\d{1,2})月/
                );
                if (periodMatch) {
                  normalizedProject.startYear = parseInt(periodMatch[1]);
                  normalizedProject.startMonth = parseInt(periodMatch[2]);
                  normalizedProject.endYear = parseInt(periodMatch[3]);
                  normalizedProject.endMonth = parseInt(periodMatch[4]);
                  normalizedProject.isPresent = false;
                }
              }
            }

            return normalizedProject;
          });
        })(),
        education: (() => {
          let education = {
            school: data.education?.school || "",
            level: data.education?.level || "",
            period: data.education?.period || "",
            major: data.education?.major || "",
            degree: data.education?.degree || "",
            duration: data.education?.duration || null,
            startYear: data.education?.startYear || null,
            startMonth: data.education?.startMonth || null,
            endYear: data.education?.endYear || null,
            endMonth: data.education?.endMonth || null,
            achievements: data.education?.achievements || [],
          };

          if (education.period && !education.startYear) {
            const periodMatch = education.period.match(
              /(\d{4})年(\d{1,2})月\s*[—\-]\s*(\d{4})年(\d{1,2})月/
            );
            if (periodMatch) {
              education.startYear = parseInt(periodMatch[1]);
              education.startMonth = parseInt(periodMatch[2]);
              education.endYear = parseInt(periodMatch[3]);
              education.endMonth = parseInt(periodMatch[4]);
            }
          }

          return education;
        })(),
      };
      setLocalData(normalizedData);
    }
  }, [data]);

  const UpdateData = (section, field, value) => {
    const newData = { ...localData };
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newData[section] = {
        ...newData[section],
        [parent]: {
          ...newData[section][parent],
          [child]: value,
        },
      };
    } else if (Array.isArray(newData[section])) {
      newData[section] = value;
    } else {
      newData[section] = {
        ...newData[section],
        [field]: value,
      };
    }
    setLocalData(newData);
    onChange(newData);
  };

  const AddItem = (section, item) => {
    const newData = { ...localData };
    newData[section] = [...newData[section], item];
    setLocalData(newData);
    onChange(newData);
  };

  const RemoveItem = (section, index) => {
    const newData = { ...localData };
    newData[section] = newData[section].filter((_, i) => i !== index);
    setLocalData(newData);
    onChange(newData);
  };

  const UpdateArrayItem = (section, index, field, value) => {
    const newData = { ...localData };
    newData[section][index] = {
      ...newData[section][index],
      [field]: value,
    };
    setLocalData(newData);
    onChange(newData);
  };

  const UpdateArrayField = (section, index, value) => {
    const newData = { ...localData };
    newData[section][index] = value;
    setLocalData(newData);
    onChange(newData);
  };

  const AddArrayField = (section, field, value) => {
    const newData = { ...localData };
    if (!newData[section][field]) {
      newData[section][field] = [];
    }
    newData[section][field] = [...newData[section][field], value];
    setLocalData(newData);
    onChange(newData);
  };

  const RemoveArrayField = (section, field, index) => {
    const newData = { ...localData };
    newData[section][field] = newData[section][field].filter(
      (_, i) => i !== index
    );
    setLocalData(newData);
    onChange(newData);
  };

  const sectionLabels = {
    tags: "专业标签",
    education: "教育背景",
    workExperiences: "工作经历",
    honors: "荣誉证书",
    projects: "项目经历",
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = localData.sectionOrder.indexOf(active.id);
      const newIndex = localData.sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(localData.sectionOrder, oldIndex, newIndex);
      const newData = { ...localData, sectionOrder: newOrder };
      setLocalData(newData);
      onChange(newData);
    }
  };

  const handleItemDragEnd = (section, event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const items = localData[section] || [];
      const oldIndex = items.findIndex(
        (_, i) => `${section}-item-${i}` === active.id
      );
      const newIndex = items.findIndex(
        (_, i) => `${section}-item-${i}` === over.id
      );
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newData = { ...localData, [section]: newItems };
      setLocalData(newData);
      onChange(newData);
    }
  };

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      {/* 左侧目录 */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">目录结构</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={localData.sectionOrder || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 py-2 px-3 bg-gray-50 rounded-md">
                  个人信息
                </div>
                {localData.sectionOrder?.map((sectionKey) => (
                  <SortableSectionItem
                    key={sectionKey}
                    id={sectionKey}
                    label={sectionLabels[sectionKey] || sectionKey}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 space-y-8">
        <Section title="个人信息">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="姓名"
              value={localData.personalInfo.name}
              onChange={(v) => UpdateData("personalInfo", "name", v)}
            />
            <InputField
              label="职位"
              value={localData.personalInfo.title}
              onChange={(v) => UpdateData("personalInfo", "title", v)}
            />
            <InputField
              label="电话"
              value={localData.personalInfo.phone}
              onChange={(v) => UpdateData("personalInfo", "phone", v)}
            />
            <InputField
              label="邮箱"
              value={localData.personalInfo.email}
              onChange={(v) => UpdateData("personalInfo", "email", v)}
            />
            <InputField
              label="年龄"
              value={localData.personalInfo.age}
              onChange={(v) => UpdateData("personalInfo", "age", v)}
            />
            <InputField
              label="博客"
              value={localData.personalInfo.blog}
              onChange={(v) => UpdateData("personalInfo", "blog", v)}
            />
            <InputField
              label="GitHub"
              value={localData.personalInfo.github}
              onChange={(v) => UpdateData("personalInfo", "github", v)}
            />
            <InputField
              label="目标城市"
              value={localData.personalInfo.targetCity}
              onChange={(v) => UpdateData("personalInfo", "targetCity", v)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作品集
            </label>
            {localData.personalInfo.works.map((work, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="作品名称"
                  value={work.name}
                  onChange={(e) => {
                    const newWorks = [...localData.personalInfo.works];
                    newWorks[index] = {
                      ...newWorks[index],
                      name: e.target.value,
                    };
                    UpdateData("personalInfo", "works", newWorks);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="作品链接"
                  value={work.url}
                  onChange={(e) => {
                    const newWorks = [...localData.personalInfo.works];
                    newWorks[index] = {
                      ...newWorks[index],
                      url: e.target.value,
                    };
                    UpdateData("personalInfo", "works", newWorks);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    const newWorks = localData.personalInfo.works.filter(
                      (_, i) => i !== index
                    );
                    UpdateData("personalInfo", "works", newWorks);
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  删除
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newWorks = [
                  ...localData.personalInfo.works,
                  { name: "", url: "" },
                ];
                UpdateData("personalInfo", "works", newWorks);
              }}
              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              + 添加作品
            </button>
          </div>
        </Section>

        {localData.sectionOrder?.map((sectionKey) => {
          if (sectionKey === "tags") {
            return (
              <Section key="tags" title="专业标签">
                <div className="flex flex-wrap gap-2">
                  {localData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...localData.tags];
                          newTags[index] = e.target.value;
                          UpdateData("tags", "", newTags);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => RemoveItem("tags", index)}
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => AddItem("tags", "")}
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
                  >
                    + 添加标签
                  </button>
                </div>
              </Section>
            );
          }
          if (sectionKey === "advantages") {
            return (
              <Section key="advantages" title="个人优势">
                {localData.advantages.map((advantage, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <textarea
                      value={advantage}
                      onChange={(e) => {
                        const newAdvantages = [...localData.advantages];
                        newAdvantages[index] = e.target.value;
                        UpdateData("advantages", "", newAdvantages);
                      }}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => RemoveItem("advantages", index)}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                    >
                      删除
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => AddItem("advantages", "")}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
                >
                  + 添加优势
                </button>
              </Section>
            );
          }
          if (sectionKey === "honors") {
            return (
              <Section key="honors" title="荣誉证书">
                {localData.honors.map((honor, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={honor}
                      onChange={(e) =>
                        UpdateArrayField("honors", index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => RemoveItem("honors", index)}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                    >
                      删除
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => AddItem("honors", "")}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
                >
                  + 添加荣誉
                </button>
              </Section>
            );
          }
          if (sectionKey === "workExperiences") {
            return (
              <Section key="workExperiences" title="工作经历">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleItemDragEnd("workExperiences", e)}
                >
                  <SortableContext
                    items={localData.workExperiences.map(
                      (_, i) => `workExperiences-item-${i}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {localData.workExperiences.map((work, index) => (
                      <SortableItem
                        key={index}
                        id={`workExperiences-item-${index}`}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputField
                              label="公司名称"
                              value={work.company}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "company",
                                  v
                                )
                              }
                            />
                            <InputField
                              label="公司类型"
                              value={work.companyType}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "companyType",
                                  v
                                )
                              }
                            />
                            <InputField
                              label="职位"
                              value={work.position}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "position",
                                  v
                                )
                              }
                            />
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                工作期间
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    起始时间
                                  </label>
                                  <div className="flex gap-2">
                                    <select
                                      value={
                                        work.startYear ||
                                        new Date().getFullYear()
                                      }
                                      onChange={(e) => {
                                        const startYear = parseInt(e.target.value);
                                        const startMonth = work.startMonth || 1;
                                        const isPresent = work.isPresent || false;
                                        
                                        let newPeriod;
                                        let endYear, endMonth;
                                        
                                        if (isPresent) {
                                          endYear = new Date().getFullYear();
                                          endMonth = new Date().getMonth() + 1;
                                          newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                        } else {
                                          endYear = work.endYear || startYear;
                                          endMonth = work.endMonth || 12;
                                          newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                        }

                                        const newWork = { ...work };
                                        newWork.startYear = startYear;
                                        newWork.startMonth = startMonth;
                                        newWork.endYear = endYear;
                                        newWork.endMonth = endMonth;
                                        newWork.isPresent = isPresent;
                                        newWork.period = newPeriod;

                                        UpdateArrayField("workExperiences", index, newWork);
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {Array.from(
                                        { length: 50 },
                                        (_, i) => new Date().getFullYear() - i
                                      ).map((year) => (
                                        <option key={year} value={year}>
                                          {year}年
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      value={work.startMonth || 1}
                                      onChange={(e) => {
                                        const startMonth = parseInt(e.target.value);
                                        const startYear =
                                          work.startYear ||
                                          new Date().getFullYear();
                                        const isPresent = work.isPresent || false;
                                        
                                        let newPeriod;
                                        let endYear, endMonth;
                                        
                                        if (isPresent) {
                                          endYear = new Date().getFullYear();
                                          endMonth = new Date().getMonth() + 1;
                                          newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                        } else {
                                          endYear = work.endYear || startYear;
                                          endMonth = work.endMonth || 12;
                                          newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                        }

                                        const newWork = { ...work };
                                        newWork.startYear = startYear;
                                        newWork.startMonth = startMonth;
                                        newWork.endYear = endYear;
                                        newWork.endMonth = endMonth;
                                        newWork.isPresent = isPresent;
                                        newWork.period = newPeriod;

                                        UpdateArrayField("workExperiences", index, newWork);
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                        (month) => (
                                          <option key={month} value={month}>
                                            {month}月
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    结束时间
                                  </label>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`work-present-${index}`}
                                        checked={work.isPresent || false}
                                        onChange={(e) => {
                                          const isPresent = e.target.checked;
                                          const startYear =
                                            work.startYear ||
                                            new Date().getFullYear();
                                          const startMonth = work.startMonth || 1;
                                          
                                          let newPeriod;
                                          let endYear, endMonth;
                                          
                                          if (isPresent) {
                                            endYear = new Date().getFullYear();
                                            endMonth = new Date().getMonth() + 1;
                                            newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                          } else {
                                            // 如果之前没有设置过结束时间，使用当前年月作为默认值
                                            endYear = work.endYear || new Date().getFullYear();
                                            endMonth = work.endMonth || (new Date().getMonth() + 1);
                                            newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                          }

                                          const newWork = { ...work };
                                          newWork.startYear = startYear;
                                          newWork.startMonth = startMonth;
                                          newWork.endYear = endYear;
                                          newWork.endMonth = endMonth;
                                          newWork.isPresent = isPresent;
                                          newWork.period = newPeriod;

                                          UpdateArrayField("workExperiences", index, newWork);
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <label
                                        htmlFor={`work-present-${index}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        至今
                                      </label>
                                    </div>
                                    {!work.isPresent && (
                                      <div className="flex gap-2">
                                        <select
                                          value={
                                            work.endYear ||
                                            (work.startYear
                                              ? work.startYear
                                              : new Date().getFullYear())
                                          }
                                          onChange={(e) => {
                                            const endYear = parseInt(e.target.value);
                                            const endMonth = work.endMonth || 12;
                                            const startYear =
                                              work.startYear ||
                                              new Date().getFullYear();
                                            const startMonth = work.startMonth || 1;

                                            const newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                            const newWork = { ...work };
                                            newWork.startYear = startYear;
                                            newWork.startMonth = startMonth;
                                            newWork.endYear = endYear;
                                            newWork.endMonth = endMonth;
                                            newWork.isPresent = false;
                                            newWork.period = newPeriod;

                                            UpdateArrayField("workExperiences", index, newWork);
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          {Array.from(
                                            { length: 50 },
                                            (_, i) => new Date().getFullYear() - i
                                          ).map((year) => (
                                            <option key={year} value={year}>
                                              {year}年
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          value={work.endMonth || 12}
                                          onChange={(e) => {
                                            const endMonth = parseInt(e.target.value);
                                            const endYear =
                                              work.endYear ||
                                              (work.startYear
                                                ? work.startYear
                                                : new Date().getFullYear());
                                            const startYear =
                                              work.startYear ||
                                              new Date().getFullYear();
                                            const startMonth = work.startMonth || 1;

                                            const newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                            const newWork = { ...work };
                                            newWork.startYear = startYear;
                                            newWork.startMonth = startMonth;
                                            newWork.endYear = endYear;
                                            newWork.endMonth = endMonth;
                                            newWork.isPresent = false;
                                            newWork.period = newPeriod;

                                            UpdateArrayField("workExperiences", index, newWork);
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                            (month) => (
                                              <option key={month} value={month}>
                                                {month}月
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <InputField
                              label="汇报对象（可选）"
                              value={work.reportTo || ""}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "reportTo",
                                  v
                                )
                              }
                            />
                            <InputField
                              label="下属人数（可选）"
                              value={work.subordinates || ""}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "subordinates",
                                  v
                                )
                              }
                            />
                            <InputField
                              label="晋升路径（可选）"
                              value={work.promotionPath || ""}
                              onChange={(v) =>
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "promotionPath",
                                  v
                                )
                              }
                              className="md:col-span-2"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              工作业绩
                            </label>
                            {work.achievements.map((achievement, aIndex) => (
                              <div key={aIndex} className="flex gap-2 mb-2">
                                <textarea
                                  value={achievement}
                                  onChange={(e) => {
                                    const newWork = { ...work };
                                    newWork.achievements[aIndex] =
                                      e.target.value;
                                    UpdateArrayItem(
                                      "workExperiences",
                                      index,
                                      "achievements",
                                      newWork.achievements
                                    );
                                  }}
                                  rows={2}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => {
                                    const newWork = { ...work };
                                    newWork.achievements =
                                      newWork.achievements.filter(
                                        (_, i) => i !== aIndex
                                      );
                                    UpdateArrayItem(
                                      "workExperiences",
                                      index,
                                      "achievements",
                                      newWork.achievements
                                    );
                                  }}
                                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                                >
                                  删除
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newWork = { ...work };
                                newWork.achievements = [
                                  ...newWork.achievements,
                                  "",
                                ];
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "achievements",
                                  newWork.achievements
                                );
                              }}
                              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              + 添加业绩
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              工作内容
                            </label>
                            {work.responsibilities.map(
                              (responsibility, rIndex) => (
                                <div key={rIndex} className="flex gap-2 mb-2">
                                  <textarea
                                    value={responsibility}
                                    onChange={(e) => {
                                      const newWork = { ...work };
                                      newWork.responsibilities[rIndex] =
                                        e.target.value;
                                      UpdateArrayItem(
                                        "workExperiences",
                                        index,
                                        "responsibilities",
                                        newWork.responsibilities
                                      );
                                    }}
                                    rows={2}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() => {
                                      const newWork = { ...work };
                                      newWork.responsibilities =
                                        newWork.responsibilities.filter(
                                          (_, i) => i !== rIndex
                                        );
                                      UpdateArrayItem(
                                        "workExperiences",
                                        index,
                                        "responsibilities",
                                        newWork.responsibilities
                                      );
                                    }}
                                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                                  >
                                    删除
                                  </button>
                                </div>
                              )
                            )}
                            <button
                              onClick={() => {
                                const newWork = { ...work };
                                newWork.responsibilities = [
                                  ...newWork.responsibilities,
                                  "",
                                ];
                                UpdateArrayItem(
                                  "workExperiences",
                                  index,
                                  "responsibilities",
                                  newWork.responsibilities
                                );
                              }}
                              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              + 添加内容
                            </button>
                          </div>
                          <button
                            onClick={() => RemoveItem("workExperiences", index)}
                            className="mt-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                          >
                            删除此工作经历
                          </button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <button
                  onClick={() =>
                    AddItem("workExperiences", {
                      company: "",
                      companyType: "",
                      position: "",
                      period: "",
                      startYear: null,
                      startMonth: null,
                      endYear: null,
                      endMonth: null,
                      isPresent: false,
                      reportTo: "",
                      subordinates: "",
                      promotionPath: "",
                      achievements: [""],
                      responsibilities: [""],
                    })
                  }
                  className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
                >
                  + 添加工作经历
                </button>
              </Section>
            );
          }
          if (sectionKey === "projects") {
            return (
              <Section key="projects" title="项目经历">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleItemDragEnd("projects", e)}
                >
                  <SortableContext
                    items={localData.projects.map(
                      (_, i) => `projects-item-${i}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {localData.projects.map((project, index) => (
                      <SortableItem
                        key={index}
                        id={`projects-item-${index}`}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InputField
                              label="项目名称"
                              value={project.name}
                              onChange={(v) =>
                                UpdateArrayItem("projects", index, "name", v)
                              }
                              className="md:col-span-2"
                            />
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                项目期间
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    起始时间
                                  </label>
                                  <div className="flex gap-2">
                                    <select
                                      value={
                                        project.startYear ||
                                        new Date().getFullYear()
                                      }
                                      onChange={(e) => {
                                        const startYear = parseInt(e.target.value);
                                        const startMonth = project.startMonth || 1;
                                        const isPresent = project.isPresent || false;
                                        
                                        let newPeriod;
                                        let endYear, endMonth;
                                        
                                        if (isPresent) {
                                          endYear = new Date().getFullYear();
                                          endMonth = new Date().getMonth() + 1;
                                          newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                        } else {
                                          endYear = project.endYear || startYear;
                                          endMonth = project.endMonth || 12;
                                          newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                        }

                                        const newProject = { ...project };
                                        newProject.startYear = startYear;
                                        newProject.startMonth = startMonth;
                                        newProject.endYear = endYear;
                                        newProject.endMonth = endMonth;
                                        newProject.isPresent = isPresent;
                                        newProject.period = newPeriod;

                                        UpdateArrayField("projects", index, newProject);
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {Array.from(
                                        { length: 50 },
                                        (_, i) => new Date().getFullYear() - i
                                      ).map((year) => (
                                        <option key={year} value={year}>
                                          {year}年
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      value={project.startMonth || 1}
                                      onChange={(e) => {
                                        const startMonth = parseInt(e.target.value);
                                        const startYear =
                                          project.startYear ||
                                          new Date().getFullYear();
                                        const isPresent = project.isPresent || false;
                                        
                                        let newPeriod;
                                        let endYear, endMonth;
                                        
                                        if (isPresent) {
                                          endYear = new Date().getFullYear();
                                          endMonth = new Date().getMonth() + 1;
                                          newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                        } else {
                                          endYear = project.endYear || startYear;
                                          endMonth = project.endMonth || 12;
                                          newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                        }

                                        const newProject = { ...project };
                                        newProject.startYear = startYear;
                                        newProject.startMonth = startMonth;
                                        newProject.endYear = endYear;
                                        newProject.endMonth = endMonth;
                                        newProject.isPresent = isPresent;
                                        newProject.period = newPeriod;

                                        UpdateArrayField("projects", index, newProject);
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                        (month) => (
                                          <option key={month} value={month}>
                                            {month}月
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    结束时间
                                  </label>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id={`project-present-${index}`}
                                        checked={project.isPresent || false}
                                        onChange={(e) => {
                                          const isPresent = e.target.checked;
                                          const startYear =
                                            project.startYear ||
                                            new Date().getFullYear();
                                          const startMonth = project.startMonth || 1;
                                          
                                          let newPeriod;
                                          let endYear, endMonth;
                                          
                                          if (isPresent) {
                                            endYear = new Date().getFullYear();
                                            endMonth = new Date().getMonth() + 1;
                                            newPeriod = `${startYear}年${startMonth}月 — 至今`;
                                          } else {
                                            // 如果之前没有设置过结束时间，使用当前年月作为默认值
                                            endYear = project.endYear || new Date().getFullYear();
                                            endMonth = project.endMonth || (new Date().getMonth() + 1);
                                            newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                          }

                                          const newProject = { ...project };
                                          newProject.startYear = startYear;
                                          newProject.startMonth = startMonth;
                                          newProject.endYear = endYear;
                                          newProject.endMonth = endMonth;
                                          newProject.isPresent = isPresent;
                                          newProject.period = newPeriod;

                                          UpdateArrayField("projects", index, newProject);
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <label
                                        htmlFor={`project-present-${index}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        至今
                                      </label>
                                    </div>
                                    {!project.isPresent && (
                                      <div className="flex gap-2">
                                        <select
                                          value={
                                            project.endYear ||
                                            (project.startYear
                                              ? project.startYear
                                              : new Date().getFullYear())
                                          }
                                          onChange={(e) => {
                                            const endYear = parseInt(e.target.value);
                                            const endMonth = project.endMonth || 12;
                                            const startYear =
                                              project.startYear ||
                                              new Date().getFullYear();
                                            const startMonth = project.startMonth || 1;

                                            const newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                            const newProject = { ...project };
                                            newProject.startYear = startYear;
                                            newProject.startMonth = startMonth;
                                            newProject.endYear = endYear;
                                            newProject.endMonth = endMonth;
                                            newProject.isPresent = false;
                                            newProject.period = newPeriod;

                                            UpdateArrayField("projects", index, newProject);
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          {Array.from(
                                            { length: 50 },
                                            (_, i) => new Date().getFullYear() - i
                                          ).map((year) => (
                                            <option key={year} value={year}>
                                              {year}年
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          value={project.endMonth || 12}
                                          onChange={(e) => {
                                            const endMonth = parseInt(e.target.value);
                                            const endYear =
                                              project.endYear ||
                                              (project.startYear
                                                ? project.startYear
                                                : new Date().getFullYear());
                                            const startYear =
                                              project.startYear ||
                                              new Date().getFullYear();
                                            const startMonth = project.startMonth || 1;

                                            const newPeriod = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                                            const newProject = { ...project };
                                            newProject.startYear = startYear;
                                            newProject.startMonth = startMonth;
                                            newProject.endYear = endYear;
                                            newProject.endMonth = endMonth;
                                            newProject.isPresent = false;
                                            newProject.period = newPeriod;

                                            UpdateArrayField("projects", index, newProject);
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                            (month) => (
                                              <option key={month} value={month}>
                                                {month}月
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <InputField
                              label="担任角色"
                              value={project.role}
                              onChange={(v) =>
                                UpdateArrayItem("projects", index, "role", v)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              项目描述
                            </label>
                            {project.description.map((desc, dIndex) => (
                              <div key={dIndex} className="flex gap-2 mb-2">
                                <textarea
                                  value={desc}
                                  onChange={(e) => {
                                    const newProject = { ...project };
                                    newProject.description[dIndex] =
                                      e.target.value;
                                    UpdateArrayItem(
                                      "projects",
                                      index,
                                      "description",
                                      newProject.description
                                    );
                                  }}
                                  rows={3}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => {
                                    const newProject = { ...project };
                                    newProject.description =
                                      newProject.description.filter(
                                        (_, i) => i !== dIndex
                                      );
                                    UpdateArrayItem(
                                      "projects",
                                      index,
                                      "description",
                                      newProject.description
                                    );
                                  }}
                                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                                >
                                  删除
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newProject = { ...project };
                                newProject.description = [
                                  ...newProject.description,
                                  "",
                                ];
                                UpdateArrayItem(
                                  "projects",
                                  index,
                                  "description",
                                  newProject.description
                                );
                              }}
                              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              + 添加描述
                            </button>
                          </div>
                          <button
                            onClick={() => RemoveItem("projects", index)}
                            className="mt-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                          >
                            删除此项目
                          </button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <button
                  onClick={() =>
                    AddItem("projects", {
                      name: "",
                      period: "",
                      startYear: null,
                      startMonth: null,
                      endYear: null,
                      endMonth: null,
                      isPresent: false,
                      role: "",
                      description: [""],
                    })
                  }
                  className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
                >
                  + 添加项目
                </button>
              </Section>
            );
          }
          if (sectionKey === "education") {
            return (
              <Section key="education" title="教育背景">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="学校名称"
                    value={localData.education.school}
                    onChange={(v) => UpdateData("education", "school", v)}
                  />
                  <InputField
                    label="学校级别"
                    value={localData.education.level}
                    onChange={(v) => UpdateData("education", "level", v)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      学历
                    </label>
                    <select
                      value={localData.education.degree}
                      onChange={(e) => {
                        const degree = e.target.value;
                        const newEducation = { ...localData.education };
                        newEducation.degree = degree;

                        if (degree && !newEducation.duration) {
                          const startYear =
                            newEducation.startYear || new Date().getFullYear();
                          const startMonth = newEducation.startMonth || 9;

                          let years = 4;
                          if (
                            degree.includes("专科") ||
                            degree.includes("高职")
                          ) {
                            years = 3;
                          } else if (
                            degree.includes("研究生") ||
                            degree.includes("硕士") ||
                            degree.includes("博士")
                          ) {
                            years = 3;
                          } else if (degree.includes("本科")) {
                            years = 4;
                          } else if (
                            degree === "高中" ||
                            degree === "中专" ||
                            degree === "技校"
                          ) {
                            years = 3;
                          }

                          const endYear = startYear + years;
                          const endMonth = startMonth;

                          newEducation.startYear = startYear;
                          newEducation.startMonth = startMonth;
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                        } else if (degree && newEducation.duration) {
                          const startYear =
                            newEducation.startYear || new Date().getFullYear();
                          const startMonth = newEducation.startMonth || 9;
                          const years = newEducation.duration;
                          const endYear = startYear + years;
                          const endMonth = startMonth;

                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                        }

                        setLocalData({ ...localData, education: newEducation });
                        onChange({ ...localData, education: newEducation });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择学历</option>
                      <option value="本科">本科</option>
                      <option value="专科">专科</option>
                      <option value="硕士研究生">硕士研究生</option>
                      <option value="博士研究生">博士研究生</option>
                      <option value="高中">高中</option>
                      <option value="中专">中专</option>
                      <option value="高职">高职</option>
                      <option value="专升本">专升本</option>
                      <option value="技校">技校</option>
                      <option value="第二学士学位">第二学士学位</option>
                      <option value="在职研究生">在职研究生</option>
                      <option value="MBA">MBA</option>
                      <option value="EMBA">EMBA</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      学制（年）
                    </label>
                    <select
                      value={localData.education.duration || ""}
                      onChange={(e) => {
                        const duration = e.target.value
                          ? parseInt(e.target.value)
                          : null;
                        const newEducation = { ...localData.education };
                        newEducation.duration = duration;

                        if (duration && newEducation.startYear) {
                          const startYear = newEducation.startYear;
                          const startMonth = newEducation.startMonth || 9;
                          const endYear = startYear + duration;
                          const endMonth = startMonth;

                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                        } else if (duration && !newEducation.startYear) {
                          const startYear = new Date().getFullYear();
                          const startMonth = 9;
                          const endYear = startYear + duration;
                          const endMonth = startMonth;

                          newEducation.startYear = startYear;
                          newEducation.startMonth = startMonth;
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                        }

                        setLocalData({ ...localData, education: newEducation });
                        onChange({ ...localData, education: newEducation });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择学制（可选）</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}年制
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <InputField
                    label="专业"
                    value={localData.education.major}
                    onChange={(v) => UpdateData("education", "major", v)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      入学时间
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={
                          localData.education.startYear ||
                          new Date().getFullYear()
                        }
                        onChange={(e) => {
                          const startYear = parseInt(e.target.value);
                          const startMonth =
                            localData.education.startMonth || 9;
                          const duration = localData.education.duration;

                          let years = duration || 4;
                          if (!duration) {
                            const degree = localData.education.degree || "";
                            if (
                              degree.includes("专科") ||
                              degree.includes("高职")
                            ) {
                              years = 3;
                            } else if (
                              degree.includes("研究生") ||
                              degree.includes("硕士") ||
                              degree.includes("博士")
                            ) {
                              years = 3;
                            } else if (degree.includes("本科")) {
                              years = 4;
                            }
                          }

                          const endYear = startYear + years;
                          const endMonth = startMonth;

                          const newEducation = { ...localData.education };
                          newEducation.startYear = startYear;
                          newEducation.startMonth = startMonth;
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                          UpdateData(
                            "education",
                            "period",
                            newEducation.period
                          );
                          setLocalData({
                            ...localData,
                            education: newEducation,
                          });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from(
                          { length: 50 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}年
                          </option>
                        ))}
                      </select>
                      <select
                        value={localData.education.startMonth || 9}
                        onChange={(e) => {
                          const startMonth = parseInt(e.target.value);
                          const startYear =
                            localData.education.startYear ||
                            new Date().getFullYear();
                          const duration = localData.education.duration;

                          let years = duration || 4;
                          if (!duration) {
                            const degree = localData.education.degree || "";
                            if (
                              degree.includes("专科") ||
                              degree.includes("高职")
                            ) {
                              years = 3;
                            } else if (
                              degree.includes("研究生") ||
                              degree.includes("硕士") ||
                              degree.includes("博士")
                            ) {
                              years = 3;
                            } else if (degree.includes("本科")) {
                              years = 4;
                            }
                          }

                          const endYear = startYear + years;
                          const endMonth = startMonth;

                          const newEducation = { ...localData.education };
                          newEducation.startYear = startYear;
                          newEducation.startMonth = startMonth;
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                          UpdateData(
                            "education",
                            "period",
                            newEducation.period
                          );
                          setLocalData({
                            ...localData,
                            education: newEducation,
                          });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {month}月
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      毕业时间
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={
                          localData.education.endYear !== null && localData.education.endYear !== undefined
                            ? localData.education.endYear
                            : (localData.education.startYear
                                ? localData.education.startYear + 4
                                : new Date().getFullYear() + 4)
                        }
                        onChange={(e) => {
                          const endYear = parseInt(e.target.value);
                          const endMonth = localData.education.endMonth !== null && localData.education.endMonth !== undefined
                            ? localData.education.endMonth
                            : 6;
                          const startYear =
                            localData.education.startYear !== null && localData.education.startYear !== undefined
                              ? localData.education.startYear
                              : new Date().getFullYear();
                          const startMonth =
                            localData.education.startMonth !== null && localData.education.startMonth !== undefined
                              ? localData.education.startMonth
                              : 9;

                          const newEducation = { ...localData.education };
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                          
                          const newData = { ...localData };
                          newData.education = newEducation;
                          setLocalData(newData);
                          onChange(newData);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from(
                          { length: 50 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}年
                          </option>
                        ))}
                      </select>
                      <select
                        value={
                          localData.education.endMonth !== null && localData.education.endMonth !== undefined
                            ? localData.education.endMonth
                            : 6
                        }
                        onChange={(e) => {
                          const endMonth = parseInt(e.target.value);
                          const endYear =
                            localData.education.endYear !== null && localData.education.endYear !== undefined
                              ? localData.education.endYear
                              : (localData.education.startYear
                                  ? localData.education.startYear + 4
                                  : new Date().getFullYear() + 4);
                          const startYear =
                            localData.education.startYear !== null && localData.education.startYear !== undefined
                              ? localData.education.startYear
                              : new Date().getFullYear();
                          const startMonth =
                            localData.education.startMonth !== null && localData.education.startMonth !== undefined
                              ? localData.education.startMonth
                              : 9;

                          const newEducation = { ...localData.education };
                          newEducation.endYear = endYear;
                          newEducation.endMonth = endMonth;
                          newEducation.period = `${startYear}年${startMonth}月 — ${endYear}年${endMonth}月`;
                          
                          const newData = { ...localData };
                          newData.education = newEducation;
                          setLocalData(newData);
                          onChange(newData);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {month}月
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    在校成就
                  </label>
                  {localData.education.achievements.map(
                    (achievement, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <textarea
                          value={achievement}
                          onChange={(e) => {
                            const newEducation = { ...localData.education };
                            newEducation.achievements[index] = e.target.value;
                            UpdateData(
                              "education",
                              "achievements",
                              newEducation.achievements
                            );
                          }}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newEducation = { ...localData.education };
                            newEducation.achievements =
                              newEducation.achievements.filter(
                                (_, i) => i !== index
                              );
                            UpdateData(
                              "education",
                              "achievements",
                              newEducation.achievements
                            );
                          }}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded"
                        >
                          删除
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() => {
                      const newEducation = { ...localData.education };
                      newEducation.achievements = [
                        ...newEducation.achievements,
                        "",
                      ];
                      UpdateData(
                        "education",
                        "achievements",
                        newEducation.achievements
                      );
                    }}
                    className="mt-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    + 添加成就
                  </button>
                </div>
              </Section>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function SortableSectionItem({ id, label }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-sm text-gray-700 py-2 px-3 bg-white border border-gray-200 rounded-md cursor-move hover:bg-gray-50 hover:border-blue-300 transition-colors"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
        {label}
      </div>
    </div>
  );
}

function SortableItem({ id, children, className = "" }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={className}>
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          className="mt-2 cursor-move text-gray-400 hover:text-gray-600"
          type="button"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default ResumeEditor;
