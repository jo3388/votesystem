<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google 試算表投票系統</title>
</head>
<body>
  <h1>投票系統</h1>
  
  <div>
    <label for="groupName">新增組別：</label>
    <input type="text" id="groupName">
    <button onclick="addGroup()">新增</button>
  </div>

  <div>
    <label for="groupSelect">選擇組別：</label>
    <select id="groupSelect">
      <option value="">請選擇投票組別</option>
    </select>
  </div>

  <div>
    <label for="voterName">您的名字：</label>
    <input type="text" id="voterName">
  </div>

  <div>
    <label for="voterComment">評論：</label>
    <input type="text" id="voterComment">
  </div>

  <button onclick="submitVote()">提交投票</button>

  <div id="results"></div>

  <script>
    const scriptUrl = "https://script.google.com/macros/s/your-script-id/exec"; // 替換為你的 Apps Script URL

    async function addGroup() {
      const groupName = document.getElementById("groupName").value.trim();
      if (!groupName) {
        alert("請輸入組別名稱！");
        return;
      }

      const response = await fetch(`${scriptUrl}?action=addGroup&groupName=${encodeURIComponent(groupName)}`, { method: "POST" });
      const result = await response.json();

      alert(result.message);
      if (result.success) {
        loadGroups();
        document.getElementById("groupName").value = "";
      }
    }

    async function loadGroups() {
      const response = await fetch(`${scriptUrl}?action=loadGroups`);
      const groups = await response.json();

      const groupSelect = document.getElementById("groupSelect");
      groupSelect.innerHTML = '<option value="">請選擇投票組別</option>';
      groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
      });
    }

    async function submitVote() {
      const voterName = document.getElementById("voterName").value.trim();
      const selectedGroup = document.getElementById("groupSelect").value;
      const comment = document.getElementById("voterComment").value.trim();

      if (!voterName || !selectedGroup) {
        alert("請填寫所有欄位！");
        return;
      }

      const response = await fetch(`${scriptUrl}?action=submitVote&voterName=${encodeURIComponent(voterName)}&group=${encodeURIComponent(selectedGroup)}&comment=${encodeURIComponent(comment)}`, { method: "POST" });
      const result = await response.json();

      alert(result.message);
      if (result.success) {
        document.getElementById("voterName").value = "";
        document.getElementById("groupSelect").value = "";
        document.getElementById("voterComment").value = "";
      }
    }

    // 初次加載時載入組別
    loadGroups();
  </script>
</body>
</html>
