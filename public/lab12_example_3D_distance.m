% In this example we demonstrate how to calculate the total distance when
% given a list of 3 dimensional position coordinates.

% A few rows of x, y, z position data
pos = [-9.2909  -13.1835  -43.7796
    -13.4494   -9.4859  -37.5953
    -15.3669   -6.8981  -33.7696
    -111.1651  233.3500  309.3831];

%% Difference Between Adjacent Points
% the difference between adjacent rows 
% 4 positions means 3 distances
posDiff = diff(pos)

%% Magnitude of the Distance
% two ways to calculate the magnitude (norm) of each row of differences
norms1 = sqrt(posDiff(:,1).^2 + posDiff(:,2).^2 + posDiff(:,3).^2)
norms2 = sqrt(sum(posDiff.^2,2))

%% Total Distance
% the total distance is the sum of all incremental distances
distance1 = sum(norms1) % or norms2, both should be equal

%% Same Thing, No Intermediate Variables

distance2 = sum(sqrt(sum(diff(pos).^2, 2)))

