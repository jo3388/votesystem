// 儲存所有投票數據
let votingData = {
    groups: [],
    votes: [],
    voters: new Set() // 用於追踪已投票的人
};

// 新增組別
function addGroup() {
    const groupNameInput = document.getElementById('groupName');
    const groupName = groupNameInput.value.trim();
    
    if (groupName === '') {
        alert('請輸入組別名稱！');
        return;
    }

    if (votingData.groups.includes(groupName)) {
        alert('此組別已存在！');
        return;
    }

    votingData.groups.push(groupName);
    groupNameInput.value = '';
    updateGroupSelect();
    updateVotingArea();
    saveData();
}

// 更新下拉選單
function updateGroupSelect() {
    const groupSelect = document.getElementById('groupSelect');
    groupSelect.innerHTML = '<option value="">請選擇投票組別</option>';
    
    votingData.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

// 更新投票區域
function updateVotingArea() {
    const votingArea = document.getElementById('votingArea');
    votingArea.innerHTML = '';
    updateResults();
}

// 提交投票
function submitVote() {
    const voterName = document.getElementById('voterName').value.trim();
    const selectedGroup = document.getElementById('groupSelect').value;
    const comment = document.getElementById('voterComment').value.trim();
    
    if (!voterName) {
        alert('請輸入您的名字！');
        return;
    }

    if (!selectedGroup) {
        alert('請選擇投票組別！');
        return;
    }

    // 檢查是否已經投票
    if (votingData.voters.has(voterName)) {
        alert('此名字已經投過票了！');
        return;
    }

    votingData.votes.push({
        voter: voterName,
        group: selectedGroup,
        comment,
        timestamp: new Date().toISOString()
    });

    votingData.voters.add(voterName); // 將投票者加入已投票名單

    // 清空輸入欄位
    document.getElementById('voterName').value = '';
    document.getElementById('groupSelect').value = '';
    document.getElementById('voterComment').value = '';
    
    updateResults();
    saveData();
    alert('投票成功！');
}

// 更新結果顯示
function updateResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // 計算每個組別的票數
    const groupCounts = {};
    votingData.groups.forEach(group => {
        groupCounts[group] = votingData.votes.filter(vote => vote.group === group).length;
    });

    // 顯示每個組別的結果
    for (const group in groupCounts) {
        const groupResult = document.createElement('div');
        groupResult.className = 'result-item';
        
        const votes = votingData.votes.filter(vote => vote.group === group);
        const voteDetails = votes.map(vote => 
            `<p><strong>${vote.voter}</strong>: ${vote.comment || '無評論'}</p>`
        ).join('');

        groupResult.innerHTML = `
            <h3>${group}</h3>
            <p>得票數: ${groupCounts[group]}</p>
            <div class="vote-details">
                ${voteDetails}
            </div>
        `;
        resultsDiv.appendChild(groupResult);
    }
}

// 保存數據到 localStorage
function saveData() {
    const dataToSave = {
        ...votingData,
        voters: Array.from(votingData.voters) // 轉換 Set 為 Array 以便儲存
    };
    localStorage.setItem('votingData', JSON.stringify(dataToSave));
}

// 載入數據
function loadData() {
    const savedData = localStorage.getItem('votingData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        votingData = {
            ...parsedData,
            voters: new Set(parsedData.voters) // 將儲存的 Array 轉回 Set
        };
        updateGroupSelect();
        updateVotingArea();
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', loadData);
